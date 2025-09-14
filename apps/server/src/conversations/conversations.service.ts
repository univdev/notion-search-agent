import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { LocalizedError } from 'src/http-exception/http-exception-data';
import { KnowledgesService } from 'src/knowledges/knowledges.service';
import { Conversation, ConversationMessageRole } from 'src/mongoose/schemas/converstation.schema';
import { SearchedNotionDocument } from 'src/notion/notion.type';
import { OpenaiService } from 'src/openai/openai.service';
import streamFactory from 'src/stream/factory/StreamFactory';

import { searchNotionByQuestionPromptFactory, SUMMARY_PROMPT } from './prompts';

@Injectable()
export class ConversationsService {
  public readonly openai: OpenAI;
  public readonly OPENAI_QUESTION_MODEL = 'gpt-4o-mini';
  public readonly OPENAI_SUMMARY_MODEL = 'gpt-4o-mini';
  public readonly WEAVIATE_SEARCH_LIMIT = 5;

  constructor(
    private readonly openAIService: OpenaiService,
    private readonly knowledgesService: KnowledgesService,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {
    this.openai = this.openAIService.getInstance();
  }

  async startNewConversation(response: Response, question: string, senderIp: string) {
    response.setHeader('Content-Type', 'text/event-stream');

    if (await this.knowledgesService.hasScheduleSyncNotionDocuments()) {
      throw new BadRequestException(
        new LocalizedError('Sync request is currently being processed', 'converstaion.question.already-syncing'),
      );
    }

    const conversation = await this.conversationModel.create({
      summary: '',
      messages: [],
    });

    const documents = await this.getDocumentsByQuestionFromVectorStore(question);
    const stream = await this.getAssistantMessageStream(question, documents, []);

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

    if (await this.knowledgesService.hasScheduleSyncNotionDocuments()) {
      throw new BadRequestException(
        new LocalizedError('Sync request is currently being processed', 'converstaion.question.already-syncing'),
      );
    }

    const conversation = await this.conversationModel.findById(conversationId);

    if (!conversation) throw new BadRequestException('Invalid conversation id');

    const MESSAGE_LIMIT = 10;
    const messages = conversation.messages.slice(MESSAGE_LIMIT * -1);
    const foundDocuments = await this.getDocumentsByQuestionFromVectorStore(question);
    const stream = await this.getAssistantMessageStream(question, foundDocuments, messages);

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

  private async getAssistantMessageStream(
    question: string,
    documents: SearchedNotionDocument[],
    messages: Conversation['messages'],
  ) {
    const stream = await this.openai.chat.completions.create({
      model: this.OPENAI_QUESTION_MODEL,
      messages: searchNotionByQuestionPromptFactory(question, documents, messages),
      stream: true,
    });

    return stream;
  }

  private async createSummary(userMessage: string, assistantMessage: string) {
    const summary = await this.openai.chat.completions.create({
      model: this.OPENAI_SUMMARY_MODEL,
      messages: [
        { role: 'system', content: SUMMARY_PROMPT },
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage },
      ],
    });

    return summary.choices[0]?.message?.content;
  }

  async getDocumentsByQuestionFromVectorStore(question: string) {
    const collection = await this.knowledgesService.getNotionDocumentCollection();

    const items = await collection.query.nearText(question, {
      limit: this.WEAVIATE_SEARCH_LIMIT,
      returnMetadata: ['distance'],
    });

    const documents = items.objects.map((document) => {
      return {
        pageId: document.properties.pageId,
        title: document.properties.title,
        content: document.properties.content,
        documentUrl: document.properties.documentUrl,
        createdAt: document.properties.createdAt,
        updatedAt: document.properties.updatedAt,
      };
    }) as SearchedNotionDocument[];

    return documents;
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
