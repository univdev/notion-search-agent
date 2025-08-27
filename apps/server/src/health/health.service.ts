import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  async check() {
    return this.health.check([
      () => this.http.pingCheck('mongodb', this.configService.get('MONGODB_HEALTH_CHECK_ENDPOINT')),
      () => this.http.pingCheck('notion', this.configService.get('NOTION_HEALTH_CHECK_ENDPOINT')),
      () => this.http.pingCheck('redis', this.configService.get('REDIS_HEALTH_CHECK_ENDPOINT')),
    ]);
  }
}
