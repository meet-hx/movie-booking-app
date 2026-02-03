import { Injectable } from "@nestjs/common";
import { ShowRepository } from "../../domain/repositories/show.repository";
import { Show } from "../../domain/entities/show";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PrismaShowRepository implements ShowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Show | null> {
    const show = await this.prisma.show.findUnique({
      where: { id },
    });

    if (!show) {
      return null;
    }

    return {
      id: show.id,
      movieId: show.movieId,
      theaterId: show.theaterId,
      theaterScreenId: show.theaterScreenId,
      startTime: show.startTime,
      endTime: show.endTime,
      basePrice: Number(show.basePrice),
    };
  }
}
