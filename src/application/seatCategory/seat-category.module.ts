import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { SeatCategoryService } from './seat-category.service';

@Module({
  imports: [PersistenceModule],
  providers: [SeatCategoryService],
  exports: [SeatCategoryService],
})
export class SeatCategoryModule {}
