import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { CONFIGS } from 'src/configs/configs';
import { NotionService } from 'src/notion/notion.service';
import { Sentence } from 'src/notion/notion.type';
import { OpenaiService } from 'src/openai/openai.service';

import { searchNotionByQuestionPromptFactory } from './search-notion-by-question-prompt.factory';

@Injectable()
export class ChatService {
  private readonly openai: OpenAI;

  constructor(
    private readonly notionService: NotionService,
    private readonly openAIService: OpenaiService,
  ) {
    this.openai = this.openAIService.getInstance();
  }

  async searchNotionByQuestion(question: string) {
    return this.notionService.getSentencesByQuestion(question).then((result) => {
      const sentences = result.objects.map((sentence) => {
        return {
          blockId: sentence.properties.id,
          value: sentence.properties.value,
          type: sentence.properties.type,
          language: sentence.properties.language,
        };
      }) as Sentence[];

      return this.openai.chat.completions
        .create({
          model: CONFIGS.OPENAI.QUESTION.MODEL,
          messages: searchNotionByQuestionPromptFactory(question, sentences),
        })
        .then((response) => {
          const result = {
            model: response.model,
            message: response.choices[0].message.content,
            usage: {
              prompt_tokens: response.usage.prompt_tokens,
              completion_tokens: response.usage.completion_tokens,
              total_tokens: response.usage.total_tokens,
            },
          };

          return {
            result,
            sentences,
          };
        });
    });
  }
}
