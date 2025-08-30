import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import Redis from 'ioredis';

import { RedisService } from './redis.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  client: Redis;

  constructor(private readonly redisService: RedisService) {
    super();
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.redisService.getClient().ping();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError('Redis check failed', this.getStatus(key, false, { error: error.message }));
    }
  }
}
