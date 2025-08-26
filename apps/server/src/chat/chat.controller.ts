import { Controller, Get, Ip, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('notion/search')
  async searchNotionByQuestion(
    @Res() response: Response,
    @Ip() ip: string,
    @Query('q') question: string,
    @Query('historyId') historyId?: string,
  ) {
    return this.chatService.searchNotionByQuestion(response, question, ip, historyId);
  }
}
