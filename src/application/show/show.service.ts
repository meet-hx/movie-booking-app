import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import type { ShowRepository } from '../../domain/repositories/show/show.repository';
import { MovieService } from '../movie/movie.service';
import { TheaterService } from '../theater/theater.service';
import { TheaterScreenService } from '../theaterScreen/theater-screen.service';
import { CreateShowRequestDto } from './dto/create-show.dto';
import { ListShowsQueryDto } from './dto/list-shows.dto';
import {
  ListShowsByMovieQueryDto,
  ListShowsByTheaterQueryDto,
  MovieShowtimesResponseDto,
  TheaterShowtimesResponseDto,
} from './dto/show-availability.dto';
import {
  ShowSeatRowDto,
  ShowSeatCategoryDto,
  ShowSeatsResponseDto,
  ShowDetailsDto,
} from './dto/show-seats-response.dto';
import { Strings } from '../../utils/strings';
import { BookingStatus } from 'src/generated/prisma/enums';

@Injectable()
export class ShowService {
  constructor(
    @Inject(REPOSITORY_TOKENS.ShowRepository)
    private readonly showRepository: ShowRepository,
    private readonly movieService: MovieService,
    private readonly theaterService: TheaterService,
    private readonly theaterScreenService: TheaterScreenService,
  ) {}

  async createShow(request: CreateShowRequestDto) {
    await Promise.all([
      this.movieService.ensureExists(request.movieId),
      this.theaterService.ensureExists(request.theaterId),
      this.theaterScreenService.ensureScreenExists(request.theaterScreenId),
    ]);

    // Validate that the screen belongs to the theater
    const screen = await this.theaterScreenService.getScreen(
      request.theaterScreenId,
    );
    if (screen && screen.theaterId !== request.theaterId) {
      throw new BadRequestException(Strings.theaterScreen.mismatch);
    }

    const startTime = new Date(request.startTime);
    const endTime = new Date(request.endTime);

    if (startTime >= endTime) {
      throw new BadRequestException(Strings.show.invalidTime);
    }

    const overlappingShow = await this.showRepository.findOverlappingShow(
      request.theaterScreenId,
      startTime,
      endTime,
    );

    if (overlappingShow) {
      throw new ConflictException(Strings.show.overlap);
    }

    return this.showRepository.create({
      movieId: request.movieId,
      theaterId: request.theaterId,
      theaterScreenId: request.theaterScreenId,
      startTime: startTime,
      endTime: endTime,
      basePrice: request.basePrice,
    });
  }

  async listShows(query: ListShowsQueryDto) {
    return this.showRepository.findAll({
      theaterId: query.theaterId,
      movieId: query.movieId,
      date: query.date ? new Date(query.date) : undefined,
    });
  }

  async listShowsByMovie(
    query: ListShowsByMovieQueryDto,
  ): Promise<TheaterShowtimesResponseDto[]> {
    const shows = await this.showRepository.findAllWithDetails({
      movieId: query.movieId,
      date: query.date ? new Date(query.date) : undefined,
    });

    const theaterMap = new Map<string, TheaterShowtimesResponseDto>();

    shows.forEach((show) => {
      const existing = theaterMap.get(show.theater.id);

      if (existing) {
        existing.startTimes.push(show.startTime);
        return;
      }

      theaterMap.set(show.theater.id, {
        ...show.theater,
        startTimes: [show.startTime],
      });
    });

    return Array.from(theaterMap.values());
  }

  async listShowsByTheater(
    query: ListShowsByTheaterQueryDto,
  ): Promise<MovieShowtimesResponseDto[]> {
    const shows = await this.showRepository.findAllWithDetails({
      theaterId: query.theaterId,
      date: query.date ? new Date(query.date) : undefined,
    });

    const movieMap = new Map<string, MovieShowtimesResponseDto>();

    shows.forEach((show) => {
      const existing = movieMap.get(show.movie.id);

      if (existing) {
        existing.startTimes.push(show.startTime);
        return;
      }

      movieMap.set(show.movie.id, {
        ...show.movie,
        startTimes: [show.startTime],
      });
    });

    return Array.from(movieMap.values());
  }

  getPricingContext(options: { showId: string; seatIds: string[] }) {
    return this.showRepository.getPricingContext(
      options.showId,
      options.seatIds,
    );
  }

  findById(id: string) {
    return this.showRepository.findById(id);
  }

  async getSeatAvailability(
    showId: string,
    userId?: string,
  ): Promise<ShowSeatsResponseDto> {
    const [data, showDetails] = await Promise.all([
      this.showRepository.getSeatAvailabilityData(showId),
      this.showRepository.findByIdWithDetails(showId),
    ]);

    if (!data) {
      throw new NotFoundException(Strings.show.notFound);
    }

    const { allSeats, bookedSeats, seatCategories, basePrice } = data;

    const categoryMap = new Map<string, ShowSeatCategoryDto>();

    // Group seats by category and organize by rows
    seatCategories.forEach((category) => {
      const categorySeats = allSeats.filter(
        (seat) => seat.seatCategoryId === category.id,
      );

      const rowMap = new Map<string, ShowSeatRowDto>();

      categorySeats.forEach((seat) => {
        let row = rowMap.get(seat.rowNumber);
        if (!row) {
          row = {
            row: seat.rowNumber,
            columns: [],
          };
          rowMap.set(seat.rowNumber, row);
        }

        const columns = seat.seatNumbers.map((seatNumber) => {
          const booking = bookedSeats.find(
            (bs) => bs.seatId === seat.id && bs.seatNumber === seatNumber,
          );

          let isAvailable = true;
          if (booking) {
            if (booking.bookingStatus === BookingStatus.CONFIRMED) {
              isAvailable = false;
            } else if (booking.bookingStatus === BookingStatus.RESERVED) {
              // If reserved by someone else, it's not available
              if (booking.userId !== userId) {
                isAvailable = false;
              }
            }
          }

          return {
            id: seatNumber,
            isAvailable,
          };
        });

        row.columns.push(...columns);
      });

      // Sort columns by seat number for each row
      rowMap.forEach((row) => {
        row.columns.sort((a, b) => a.id - b.id);
      });

      const categoryDto: ShowSeatCategoryDto = {
        title: category.name,
        price: basePrice + category.additionalPrice,
        rows: Array.from(rowMap.values()).sort((a, b) =>
          a.row.localeCompare(b.row),
        ),
      };

      categoryMap.set(category.id, categoryDto);
    });

    if (!showDetails) {
      throw new NotFoundException(Strings.show.notFound);
    }

    const showDto: ShowDetailsDto = {
      id: showId,
      startTime: showDetails.startTime,
      endTime: new Date(showDetails.startTime.getTime() + 2 * 60 * 60 * 1000), // Approximate end time
      movie: {
        id: showDetails.movie.id,
        title: showDetails.movie.title,
        description: showDetails.movie.description || '',
        duration: showDetails.movie.duration,
        type: showDetails.movie.type,
      },
      theater: {
        id: showDetails.theater.id,
        name: showDetails.theater.name,
        address: showDetails.theater.address,
        city: showDetails.theater.city,
        state: showDetails.theater.state,
        zipCode: showDetails.theater.zipCode,
        country: showDetails.theater.country,
      },
    };

    return {
      show: showDto,
      categories: Array.from(categoryMap.values()).sort((a, b) =>
        a.title.localeCompare(b.title),
      ),
    };
  }
}
