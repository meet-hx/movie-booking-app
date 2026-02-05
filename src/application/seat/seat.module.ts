import { Module, forwardRef } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { SeatCategoryModule } from '../seatCategory/seat-category.module';
import { TheaterScreenModule } from '../theaterScreen/theater-screen.module';

@Module({
  imports: [
    PersistenceModule,
    SeatCategoryModule,
    forwardRef(() => TheaterScreenModule),
  ],
  providers: [SeatService],
  controllers: [SeatController],
  exports: [SeatService],
})
export class SeatModule {}
