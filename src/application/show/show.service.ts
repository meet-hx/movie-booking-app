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
import { Strings } from '../../utils/strings';

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

  getPricingContext(options: { showId: string; seatIds: string[] }) {
    return this.showRepository.getPricingContext(
      options.showId,
      options.seatIds,
    );
  }

  findById(id: string) {
    return this.showRepository.findById(id);
  }
}
