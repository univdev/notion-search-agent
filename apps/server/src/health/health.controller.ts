import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';

import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/')
  @HealthCheck()
  async getHealth() {
    return this.healthService.check();
  }
}
