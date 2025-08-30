import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model, Schema } from 'mongoose';
import OpenAI from 'openai';
import { Config } from 'src/config/config';
import { Conversation, ConverstationMessageRole } from 'src/mongoose/schemas/converstation.schema';
import { NotionService } from 'src/notion/notion.service';
import { Sentence } from 'src/notion/notion.type';
import { OpenaiService } from 'src/openai/openai.service';
import streamFactory from 'src/stream/factory/StreamFactory';
import { WeaviateService } from 'src/weaviate/weaviate.service';

import { searchNotionByQuestionPromptFactory, SUMMARY_PROMPT } from './prompts';

@Injectable()
export class ConversationsService {
  private readonly openai: OpenAI;

  constructor(
    private readonly weaviateService: WeaviateService,
    private readonly notionService: NotionService,
    private readonly openAIService: OpenaiService,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {
    this.openai = this.openAIService.getInstance();
  }

  async searchNotionByQuestion(response: Response, question: string, senderIp: string, conversationId?: string) {
    let lastHistoryId: Schema.Types.ObjectId = null;

    try {
      response.setHeader('Content-Type', 'text/event-stream');
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Connection', 'keep-alive');

      let conversation: Conversation = null;

      if (conversationId) {
        conversation = await this.conversationModel.findById(conversationId);
        if (conversation === null) throw new BadRequestException('Invalid conversation id');
      } else {
        conversation = await this.conversationModel.create({
          messages: [{ role: ConverstationMessageRole.USER, content: question, createdAt: new Date() }],
          ip: senderIp,
        });
      }

      lastHistoryId = conversation._id;

      response.write(streamFactory('event', 'select-conversation'));
      response.write(
        streamFactory('data', {
          converstationId: conversation._id,
        }),
      );

      return this.getSentencesByQuestion(question).then(async (result) => {
        let message = '';

        const sentences = result.objects.map((sentence) => {
          return {
            blockId: sentence.properties.id,
            value: sentence.properties.value,
            type: sentence.properties.type,
            language: sentence.properties.language,
          };
        }) as Sentence[];

        const stream = await this.openai.chat.completions.create({
          model: Config.OPENAI.QUESTION.MODEL,
          messages: searchNotionByQuestionPromptFactory(question, sentences),
          stream: true,
        });

        response.write(streamFactory('event', 'send-message'));
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            message += content;
            response.write(
              streamFactory('data', {
                message,
                isCompleted: false,
              }),
            );
          }
        }

        response.write(streamFactory('event', 'completed'));
        response.write(streamFactory('data', { message, isCompleted: true, isError: false }));

        if (conversation.summary === null) {
          await this.conversationModel.updateOne(
            { _id: conversation._id },
            {
              summary: await this.createSummary(question, message),
              messages: [
                ...conversation.messages,
                { role: ConverstationMessageRole.USER, content: question, createdAt: new Date() },
                { role: ConverstationMessageRole.ASSISTANT, content: message, createdAt: new Date() },
              ],
            },
          );
        } else {
          await this.conversationModel.updateOne(
            { _id: conversation._id },
            {
              messages: [
                ...conversation.messages,
                { role: ConverstationMessageRole.USER, content: question, createdAt: new Date() },
                { role: ConverstationMessageRole.ASSISTANT, content: message, createdAt: new Date() },
              ],
            },
          );
        }

        response.end();
      });
    } catch (error) {
      response.write(streamFactory('event', 'error'));

      if (lastHistoryId && conversationId === undefined) {
        await this.conversationModel.deleteOne({ _id: lastHistoryId });
      }

      if (error instanceof HttpException) {
        response.write(
          streamFactory('data', {
            message: error.message,
            isCompleted: false,
            isError: true,
          }),
        );
      } else {
        response.write(
          streamFactory('data', {
            message: 'Internal server error',
            isCompleted: false,
            isError: true,
          }),
        );
      }
      response.end();
    }
  }

  private async createSummary(userMessage: string, assistantMessage: string) {
    const summary = await this.openai.chat.completions.create({
      model: Config.OPENAI.SUMMARY.MODEL,
      messages: [
        { role: 'system', content: SUMMARY_PROMPT },
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage },
      ],
    });

    return summary.choices[0]?.message?.content;
  }

  async getSentencesByQuestion(question: string) {
    const store = this.weaviateService.getInstance();
    const collection = await store.collections.use(Config.WEAVIATE.COLLECTIONS.SENTENCES);

    return collection.query.nearText(question, {
      limit: Config.NOTION_SENTENCES.SEARCH_LIMIT,
      returnMetadata: ['distance'],
    });
  }

  async getConversations(offset: number, limit: number) {
    const conversations = await this.conversationModel.find().skip(offset).limit(limit).sort({ createdAt: -1 });

    return conversations;
  }

  async getConverstationDetail(conversationId: string) {
    const conversation = await this.conversationModel.findById(conversationId);

    if (!conversation) throw new BadRequestException('Invalid conversation id');

    return conversation;
  }
}
