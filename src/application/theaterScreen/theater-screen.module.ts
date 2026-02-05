import { Module, forwardRef } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { TheaterScreenService } from './theater-screen.service';
import { TheaterScreenController } from './theater-screen.controller';
import { SeatModule } from '../seat/seat.module';
import { SeatCategoryModule } from '../seatCategory/seat-category.module';
import { TheaterModule } from '../theater/theater.module';

@Module({
  imports: [
    PersistenceModule,
    SeatCategoryModule,
    forwardRef(() => TheaterModule),
    forwardRef(() => SeatModule),
  ],
  providers: [TheaterScreenService],
  controllers: [TheaterScreenController],
  exports: [TheaterScreenService],
})
export class TheaterScreenModule {}
