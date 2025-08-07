import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotionService } from './notion/notion.service';

let envFileName = '.env.development';

if (process.env.NODE_ENV === 'production') envFileName = '.env.production';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFileName,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, NotionService],
})
export class AppModule {}
