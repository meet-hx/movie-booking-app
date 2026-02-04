import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { REPOSITORY_TOKENS } from 'src/infrastructure/persistence/tokens';
import { PrismaBookingRepository } from 'src/infrastructure/prisma/repositories/prisma-booking.repository';
import { ShowModule } from '../show/show.module';

@Module({
  imports: [ShowModule],
  providers: [
    BookingService,
    {
      provide: REPOSITORY_TOKENS.BookingRepository,
      useClass: PrismaBookingRepository,
    },
  ],
  exports: [BookingService],
})
export class BookingModule {}
