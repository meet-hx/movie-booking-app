import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import type { MovieRepository } from '../../domain/repositories/movie/movie.repository';
import { Strings } from '../../utils/strings';
import { CreateMovieRequestDto } from './dto/create-movie.dto';
import { UpdateMovieRequestDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @Inject(REPOSITORY_TOKENS.MovieRepository)
    private readonly movieRepository: MovieRepository,
  ) {}

  async create(request: CreateMovieRequestDto) {
    const existingMovie = await this.movieRepository.findByTitle(request.title);
    if (existingMovie) {
      throw new ConflictException('A movie with this title already exists.');
    }

    return this.movieRepository.create({
      title: request.title,
      description: request.description,
      duration: request.duration,
      type: request.type,
      genreId: request.genreId,
    });
  }

  async update(id: string, request: UpdateMovieRequestDto) {
    await this.ensureExists(id);

    if (request.title) {
      const existingMovie = await this.movieRepository.findByTitle(
        request.title,
      );
      if (existingMovie && existingMovie.id !== id) {
        throw new ConflictException('A movie with this title already exists.');
      }
    }

    return this.movieRepository.update(id, {
      title: request.title,
      description: request.description,
      duration: request.duration,
      type: request.type,
      genreId: request.genreId,
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    await this.movieRepository.delete(id);
    return { deleted: true };
  }

  async findAll() {
    return this.movieRepository.findAll();
  }

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
