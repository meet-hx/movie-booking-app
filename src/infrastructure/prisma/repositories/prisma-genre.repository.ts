import { Injectable } from '@nestjs/common';
import { GenreRepository } from '../../../domain/repositories/genre/genre.repository';
import { Genre } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaGenreRepository implements GenreRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Genre | null> {
    return this.prisma.genre.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(genre);
  }
}
