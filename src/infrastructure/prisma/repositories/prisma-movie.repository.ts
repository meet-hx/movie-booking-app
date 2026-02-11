import { Injectable } from '@nestjs/common';
import {
  MovieRepository,
  CreateMovieData,
  UpdateMovieData,
} from '../../../domain/repositories/movie/movie.repository';
import { Movie } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaMovieRepository implements MovieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Movie | null> {
    return this.prisma.movie.findFirst({
      where: { id, deletedAt: null },
      include: {
        genre: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
    });
  }

  async findByTitle(title: string): Promise<Movie | null> {
    return this.prisma.movie.findFirst({
      where: {
        title: {
          equals: title,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const movie = await this.prisma.movie.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    return Boolean(movie);
  }

  async create(data: CreateMovieData): Promise<Movie> {
    return this.prisma.movie.create({
      data: {
        title: data.title,
        description: data.description,
        duration: data.duration,
        type: data.type,
        genreId: data.genreId,
      },
      include: {
        genre: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateMovieData): Promise<Movie> {
    return this.prisma.movie.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        duration: data.duration,
        type: data.type,
        genreId: data.genreId,
      },
      include: {
        genre: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.movie.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findAll(): Promise<Movie[]> {
    return this.prisma.movie.findMany({
      where: { deletedAt: null },
      include: {
        genre: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
      orderBy: { title: 'asc' },
    });
  }
}
