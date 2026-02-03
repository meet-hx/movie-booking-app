import { Module } from "@nestjs/common";
import { BookSeatsService } from "../../application/services/book-seats.service";
import { PrismaModule } from "../../infrastructure/prisma/prisma.module";
import { PrismaBookingRepository } from "../../infrastructure/repositories/prisma-booking.repository";
import { PrismaMovieRepository } from "../../infrastructure/repositories/prisma-movie.repository";
import { PrismaShowRepository } from "../../infrastructure/repositories/prisma-show.repository";
import {
  BOOKING_REPOSITORY,
  MOVIE_REPOSITORY,
  SHOW_REPOSITORY,
} from "../../infrastructure/tokens/repository.tokens";

@Module({
  imports: [PrismaModule],
  providers: [
    BookSeatsService,
    { provide: MOVIE_REPOSITORY, useClass: PrismaMovieRepository },
    { provide: SHOW_REPOSITORY, useClass: PrismaShowRepository },
    { provide: BOOKING_REPOSITORY, useClass: PrismaBookingRepository },
  ],
  exports: [BookSeatsService],
})
export class BookingModule {}
