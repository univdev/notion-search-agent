import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { Config } from 'src/config/config';
import { Conversation, ConversationMessageRole } from 'src/mongoose/schemas/converstation.schema';
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
    private readonly openAIService: OpenaiService,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {
    this.openai = this.openAIService.getInstance();
  }

  async startNewConversation(response: Response, question: string, senderIp: string) {
    response.setHeader('Content-Type', 'text/event-stream');

    const conversation = await this.conversationModel.create({
      summary: '',
      messages: [],
    });

    const sentences = await this.getSentencesByQuestion(question);
    const stream = await this.getAssistantMessageStream(question, sentences, []);

    response.write(
      streamFactory('data', {
        conversationId: conversation._id.toString(),
      }),
    );

    let assistantMessage = '';

    for await (const chunk of stream) {
      assistantMessage += chunk.choices[0]?.delta?.content || '';

      response.write(
        streamFactory('data', {
          message: assistantMessage,
          isCompleted: false,
        }),
      );
    }

    const summary = await this.createSummary(question, assistantMessage);

    await this.conversationModel.updateOne(
      { _id: conversation._id },
      {
        summary,
        messages: [
          ...conversation.messages,
          { role: ConversationMessageRole.USER, content: question, senderIp },
          { role: ConversationMessageRole.ASSISTANT, content: assistantMessage, senderIp },
        ],
      },
    );

    response.write(
      streamFactory('data', {
        message: assistantMessage,
        isCompleted: true,
      }),
    );

    response.end();
  }

  async continueQuestion(response: Response, question: string, conversationId: string, senderIp: string) {
    response.setHeader('Content-Type', 'text/event-stream');

    const conversation = await this.conversationModel.findById(conversationId);

    if (!conversation) throw new BadRequestException('Invalid conversation id');

    const MESSAGE_LIMIT = 10;
    const messages = conversation.messages.slice(MESSAGE_LIMIT * -1);
    const sentences = await this.getSentencesByQuestion(question);
    const stream = await this.getAssistantMessageStream(question, sentences, messages);

    let assistantMessage = '';

    for await (const chunk of stream) {
      assistantMessage += chunk.choices[0]?.delta?.content || '';
      response.write(
        streamFactory('data', {
          message: assistantMessage,
          isCompleted: false,
        }),
      );
    }

    await this.conversationModel.updateOne(
      { _id: conversationId },
      {
        messages: [
          ...conversation.messages,
          { role: ConversationMessageRole.USER, content: question, senderIp },
          { role: ConversationMessageRole.ASSISTANT, content: assistantMessage, senderIp },
        ],
      },
    );

    response.write(
      streamFactory('data', {
        message: assistantMessage,
        isCompleted: true,
      }),
    );

    response.end();
  }

  private async getAssistantMessageStream(question: string, sentences: Sentence[], messages: Conversation['messages']) {
    const stream = await this.openai.chat.completions.create({
      model: Config.OPENAI.QUESTION.MODEL,
      messages: searchNotionByQuestionPromptFactory(question, sentences, messages),
      stream: true,
    });

    return stream;
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

    const items = await collection.query.nearText(question, {
      limit: Config.NOTION_SENTENCES.SEARCH_LIMIT,
      returnMetadata: ['distance'],
    });

    const sentences = items.objects.map((sentence) => {
      return {
        blockId: sentence.properties.id,
        value: sentence.properties.value,
        type: sentence.properties.type,
        language: sentence.properties.language,
      };
    }) as Sentence[];

    return sentences;
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
