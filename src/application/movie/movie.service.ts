import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import type { MovieRepository } from '../../domain/repositories/movie/movie.repository';
import { Strings } from '../../utils/strings';

@Injectable()
export class MovieService {
  constructor(
    @Inject(REPOSITORY_TOKENS.MovieRepository)
    private readonly movieRepository: MovieRepository,
  ) {}

  async ensureExists(id: string) {
    const exists = await this.movieRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(Strings.movie.notFound);
    }
  }

  async findById(id: string) {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new NotFoundException(Strings.movie.notFound);
    }
    return movie;
  }
}
