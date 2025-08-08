import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get('/')
  @HealthCheck()
  async getHealth() {
    try {
      return this.health.check([
        () => this.http.pingCheck('mongodb', this.configService.get('MONGODB_HEALTH_CHECK_ENDPOINT')),
        () => this.http.pingCheck('notion', this.configService.get('NOTION_HEALTH_CHECK_ENDPOINT')),
      ]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
