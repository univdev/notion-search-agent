import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from 'src/config/config.module';

import { RedisHealthIndicator } from './redis.health-indicator';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule],
  providers: [RedisService, ConfigService, RedisHealthIndicator],
  exports: [RedisService, RedisHealthIndicator],
})
export class RedisModule {}
