import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { RedisHealthIndicator } from 'src/redis/redis.health-indicator';

@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly redisHealthIndicator: RedisHealthIndicator,
  ) {}

  async check() {
    return this.health.check([
      () => this.http.pingCheck('mongodb', this.configService.get('MONGODB_HEALTH_CHECK_ENDPOINT')),
      () => this.http.pingCheck('weaviate', this.configService.get('WEAVIATE_HEALTH_CHECK_ENDPOINT')),
      () => this.redisHealthIndicator.pingCheck('redis'),
    ]);
  }
}
