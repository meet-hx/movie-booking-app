import { Injectable } from "@nestjs/common";
import { MovieRepository } from "../../domain/repositories/movie.repository";
import { Movie } from "../../domain/entities/movie";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PrismaMovieRepository implements MovieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Movie | null> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      return null;
    }

    return {
      id: movie.id,
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      genreId: movie.genreId,
      type: movie.type,
    };
  }
}
