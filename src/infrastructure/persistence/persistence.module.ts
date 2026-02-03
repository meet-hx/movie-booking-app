import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { REPOSITORY_TOKENS } from './tokens';
import { PrismaMovieRepository } from '../prisma/repositories/prisma-movie.repository';
import { PrismaBookingRepository } from '../prisma/repositories/prisma-booking.repository';
import { PrismaShowRepository } from '../prisma/repositories/prisma-show.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: REPOSITORY_TOKENS.MovieRepository,
      useClass: PrismaMovieRepository,
    },
    {
      provide: REPOSITORY_TOKENS.BookingRepository,
      useClass: PrismaBookingRepository,
    },
    {
      provide: REPOSITORY_TOKENS.ShowRepository,
      useClass: PrismaShowRepository,
    },
  ],
  exports: [REPOSITORY_TOKENS.MovieRepository, REPOSITORY_TOKENS.BookingRepository, REPOSITORY_TOKENS.ShowRepository],
})
export class PersistenceModule {}
