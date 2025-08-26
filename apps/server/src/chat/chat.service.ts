import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model, Schema } from 'mongoose';
import OpenAI from 'openai';
import { CONFIGS } from 'src/configs/configs';
import { ChatHistory, ChatHistoryMessageRole } from 'src/mongoose/schemas/chat-history.schema';
import { NotionService } from 'src/notion/notion.service';
import { Sentence } from 'src/notion/notion.type';
import { OpenaiService } from 'src/openai/openai.service';
import streamFactory from 'src/stream/factory/StreamFactory';

import { searchNotionByQuestionPromptFactory } from './search-notion-by-question-prompt.factory';
import { SUMMARY_PROMPT } from './summary-prompt';

@Injectable()
export class ChatService {
  private readonly openai: OpenAI;

  constructor(
    private readonly notionService: NotionService,
    private readonly openAIService: OpenaiService,
    @InjectModel(ChatHistory.name)
    private readonly chatHistoryModel: Model<ChatHistory>,
  ) {
    this.openai = this.openAIService.getInstance();
  }

  async searchNotionByQuestion(response: Response, question: string, senderIp: string, historyId?: string) {
    let lastHistoryId: Schema.Types.ObjectId = null;

    try {
      response.setHeader('Content-Type', 'text/event-stream');
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Connection', 'keep-alive');

      let history: ChatHistory = null;

      if (historyId) {
        history = await this.chatHistoryModel.findById(historyId);
        if (history === null) throw new BadRequestException('Invalid history id');
      } else {
        history = await this.chatHistoryModel.create({
          messages: [{ role: ChatHistoryMessageRole.USER, content: question, createdAt: new Date() }],
          ip: senderIp,
        });
      }

      lastHistoryId = history._id;

      response.write(
        streamFactory({
          chatHistoryId: history._id,
        }),
      );

      return this.notionService.getSentencesByQuestion(question).then(async (result) => {
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
          model: CONFIGS.OPENAI.QUESTION.MODEL,
          messages: searchNotionByQuestionPromptFactory(question, sentences),
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            message += content;
            response.write(
              streamFactory({
                message,
                isCompleted: false,
              }),
            );
          }
        }

        response.write(streamFactory({ message, isCompleted: true, isError: false }));

        if (history.summary === null) {
          await this.chatHistoryModel.updateOne(
            { _id: history._id },
            {
              summary: await this.createSummary(question, message),
              messages: [
                ...history.messages,
                { role: ChatHistoryMessageRole.USER, content: question, createdAt: new Date() },
                { role: ChatHistoryMessageRole.ASSISTANT, content: message, createdAt: new Date() },
              ],
            },
          );
        } else {
          await this.chatHistoryModel.updateOne(
            { _id: history._id },
            {
              messages: [
                ...history.messages,
                { role: ChatHistoryMessageRole.USER, content: question, createdAt: new Date() },
                { role: ChatHistoryMessageRole.ASSISTANT, content: message, createdAt: new Date() },
              ],
            },
          );
        }

        response.end();
      });
    } catch (error) {
      if (lastHistoryId && historyId === undefined) {
        await this.chatHistoryModel.deleteOne({ _id: lastHistoryId });
      }

      if (error instanceof HttpException)
        response.write(
          streamFactory({
            message: error.message,
            isCompleted: false,
            isError: true,
          }),
        );
      response.end();
    }
  }

  private async createSummary(userMessage: string, assistantMessage: string) {
    const summary = await this.openai.chat.completions.create({
      model: CONFIGS.OPENAI.SUMMARY.MODEL,
      messages: [
        { role: 'system', content: SUMMARY_PROMPT },
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage },
      ],
    });

    return summary.choices[0]?.message?.content;
  }
}
