import { Module } from '@nestjs/common';
import { MongooseModule } from 'src/mongoose/mongoose.module';

import { SyncHistoriesController } from './sync-histories.controller';
import { SyncHistoriesService } from './sync-histories.service';

@Module({
  imports: [MongooseModule],
  controllers: [SyncHistoriesController],
  providers: [SyncHistoriesService],
  exports: [SyncHistoriesService],
})
export class SyncHistoriesModule {}
