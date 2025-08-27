import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from 'src/config/config.module';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [ConfigModule, TerminusModule],
  controllers: [HealthController],
  providers: [HealthService, ConfigService],
  exports: [HealthService],
})
export class HealthModule {}
