import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  async check() {
    return this.health.check([
      () => this.http.pingCheck('mongodb', process.env.MONGOOSE_HOST),
      () => this.http.pingCheck('notion', process.env.NOTION_HOST),
    ]);
  }
}
