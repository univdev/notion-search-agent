import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from 'src/config/config.module';
import { MongooseModule } from 'src/mongoose/mongoose.module';

import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';

@Module({
  imports: [MongooseModule, ConfigModule],
  controllers: [NavigationController],
  providers: [NavigationService, ConfigService],
  exports: [NavigationService],
})
export class NavigationModule {}
