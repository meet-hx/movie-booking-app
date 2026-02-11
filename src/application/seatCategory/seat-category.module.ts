import { Module, forwardRef } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { SeatCategoryService } from './seat-category.service';
import { SeatCategoryController } from './seat-category.controller';
import { TheaterScreenModule } from '../theaterScreen/theater-screen.module';

@Module({
  imports: [PersistenceModule, forwardRef(() => TheaterScreenModule)],
  providers: [SeatCategoryService],
  controllers: [SeatCategoryController],
  exports: [SeatCategoryService],
})
export class SeatCategoryModule {}
