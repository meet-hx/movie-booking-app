import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { REPOSITORY_TOKENS } from './tokens';
import { PrismaMovieRepository } from '../prisma/repositories/prisma-movie.repository';
import { PrismaBookingRepository } from '../prisma/repositories/prisma-booking.repository';
import { PrismaShowRepository } from '../prisma/repositories/prisma-show.repository';
import { PrismaUserRepository } from '../prisma/repositories/prisma-user.repository';
import { PrismaGenreRepository } from '../prisma/repositories/prisma-genre.repository';
import { PrismaLanguageRepository } from '../prisma/repositories/prisma-language.repository';
import { PrismaTheaterRepository } from '../prisma/repositories/prisma-theater.repository';
import { PrismaTheaterScreenRepository } from '../prisma/repositories/prisma-theaterScreen.repository';
import { PrismaSeatCategoryRepository } from '../prisma/repositories/prisma-seatCategory.repository';
import { PrismaScreenSeatRepository } from '../prisma/repositories/prisma-screenSeat.repository';
import { PrismaBookingSeatRepository } from '../prisma/repositories/prisma-bookingSeat.repository';

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
    {
      provide: REPOSITORY_TOKENS.UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: REPOSITORY_TOKENS.GenreRepository,
      useClass: PrismaGenreRepository,
    },
    {
      provide: REPOSITORY_TOKENS.LanguageRepository,
      useClass: PrismaLanguageRepository,
    },
    {
      provide: REPOSITORY_TOKENS.TheaterRepository,
      useClass: PrismaTheaterRepository,
    },
    {
      provide: REPOSITORY_TOKENS.TheaterScreenRepository,
      useClass: PrismaTheaterScreenRepository,
    },
    {
      provide: REPOSITORY_TOKENS.SeatCategoryRepository,
      useClass: PrismaSeatCategoryRepository,
    },
    {
      provide: REPOSITORY_TOKENS.ScreenSeatRepository,
      useClass: PrismaScreenSeatRepository,
    },
    {
      provide: REPOSITORY_TOKENS.BookingSeatRepository,
      useClass: PrismaBookingSeatRepository,
    },
  ],
  exports: [
    REPOSITORY_TOKENS.MovieRepository,
    REPOSITORY_TOKENS.BookingRepository,
    REPOSITORY_TOKENS.ShowRepository,
    REPOSITORY_TOKENS.UserRepository,
    REPOSITORY_TOKENS.GenreRepository,
    REPOSITORY_TOKENS.LanguageRepository,
    REPOSITORY_TOKENS.TheaterRepository,
    REPOSITORY_TOKENS.TheaterScreenRepository,
    REPOSITORY_TOKENS.SeatCategoryRepository,
    REPOSITORY_TOKENS.ScreenSeatRepository,
    REPOSITORY_TOKENS.BookingSeatRepository,
  ],
})
export class PersistenceModule {}

