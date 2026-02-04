import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ShowModule } from '../show/show.module';
import { PersistenceModule } from 'src/infrastructure/persistence/persistence.module';

@Module({
  imports: [ShowModule, PersistenceModule],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
