import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import weaviate, { WeaviateClient } from 'weaviate-client';

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
      });
  }

  getInstance() {
    return this.client;
  }
}
