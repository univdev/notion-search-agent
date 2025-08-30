import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Ip,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { HttpExceptionData } from 'src/http-exception/http-exception-data';

import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get('/')
  async getConversations(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.conversationsService.getConversations(offset, limit);
  }

  @Get('/:id')
  async getConverstationDetail(@Param('id') id: string) {
    return this.conversationsService.getConverstationDetail(id);
  }

  @Post('/')
  async conversation(
    @Body('question') question: string,
    @Body('converstationId') converstationId: string,
    @Response() response: ExpressResponse,
    @Ip() senderIp: string,
  ) {
    if (!question) throw new BadRequestException(new HttpExceptionData('conversation.question.question-required'));

    return this.conversationsService.searchNotionByQuestion(response, question, senderIp, converstationId);
  }
}
