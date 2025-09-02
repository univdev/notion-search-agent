import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

let envFileName = '.env.development';

if (process.env.NODE_ENV === 'production') envFileName = '.env.production';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: envFileName,
    }),
  ],
})
export class ConfigModule {}
