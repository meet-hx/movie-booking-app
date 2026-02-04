import { Injectable } from '@nestjs/common';
import { MovieRepository } from '../../../domain/repositories/movie/movie.repository';
import { Movie } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaMovieRepository implements MovieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Movie | null> {
    return this.prisma.movie.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        type: true,
        genreId: true,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(movie);
  }
}
