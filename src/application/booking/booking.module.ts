import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ShowModule } from '../show/show.module';
import { PersistenceModule } from 'src/infrastructure/persistence/persistence.module';
import { BookingController } from './booking.controller';
import { SeatModule } from '../seat/seat.module';

@Module({
  imports: [ShowModule, SeatModule, PersistenceModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
