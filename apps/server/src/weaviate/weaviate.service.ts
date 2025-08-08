import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONFIGS } from 'src/configs/configs';
import weaviate, { vectors, WeaviateClient } from 'weaviate-client';

@Injectable()
export class WeaviateService {
  private client: WeaviateClient;

  constructor(private readonly configService: ConfigService) {
    weaviate
      .connectToLocal({
        headers: {
          'x-openai-api-key': this.configService.get('OPENAI_API_KEY'),
        },
        host: this.configService.get('WEAVIATE_HOST'),
        port: this.configService.get('WEAVIATE_PORT'),
      })
      .then((client) => {
        this.client = client;

        this.client.collections.exists(CONFIGS.WEAVIATE.COLLECTIONS.SENTENCES).then((isExist) => {
          if (isExist === false) {
            this.client.collections.create({
              name: CONFIGS.WEAVIATE.COLLECTIONS.SENTENCES,
              properties: [
                { name: 'blockId', dataType: 'text' },
                { name: 'value', dataType: 'text' },
                { name: 'type', dataType: 'text' },
                { name: 'language', dataType: 'text' },
              ],
              vectorizers: vectors.text2VecOpenAI({
                model: CONFIGS.WEAVIATE.VECTORIZER.MODEL,
                dimensions: CONFIGS.WEAVIATE.VECTORIZER.DIMENSIONS,
              }),
            });
          }
        });
      });
  }

  getInstance() {
    return this.client;
  }
}
