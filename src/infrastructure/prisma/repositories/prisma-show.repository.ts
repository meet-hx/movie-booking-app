import { Injectable } from '@nestjs/common';
import {
  ShowRepository,
  CreateShowData,
  ShowFilters,
} from '../../../domain/repositories/show/show.repository';
import { Show } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaShowRepository implements ShowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Show | null> {
    const show = await this.prisma.show.findUnique({
      where: { id },
      select: {
        id: true,
        movieId: true,
        theaterId: true,
        theaterScreenId: true,
        startTime: true,
        endTime: true,
        basePrice: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    if (!show) {
      return null;
    }

    return {
      ...show,
    };
  }

  async getPricingContext(
    showId: string,
    seatIds: string[],
  ): Promise<any | null> {
    const show = await this.prisma.show.findUnique({
      where: { id: showId },
      select: {
        id: true,
        basePrice: true,
        theaterScreenId: true,
      },
    });

    if (!show) {
      return null;
    }

    const seats = await this.prisma.screenSeat.findMany({
      where: {
        id: { in: seatIds },
        theaterScreenId: show.theaterScreenId,
      },
      select: {
        id: true,
        seatCategory: {
          select: {
            additionalPrice: true,
          },
        },
      },
    });

    return {
      showId: show.id,
      basePrice: show.basePrice.toNumber(),
      seatAdjustments: seats.map((seat) => ({
        seatId: seat.id,
        additionalPrice: seat.seatCategory.additionalPrice.toNumber(),
      })),
    };
  }

  async create(data: CreateShowData): Promise<Show> {
    return this.prisma.show.create({
      data: {
        movieId: data.movieId,
        theaterId: data.theaterId,
        theaterScreenId: data.theaterScreenId,
        startTime: data.startTime,
        endTime: data.endTime,
        basePrice: data.basePrice,
      },
    });
  }

  async findAll(filters: ShowFilters): Promise<Show[]> {
    const where: any = {};

    if (filters.theaterId) {
      where.theaterId = filters.theaterId;
    }

    if (filters.movieId) {
      where.movieId = filters.movieId;
    }

    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);

      where.startTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    return this.prisma.show.findMany({
      where,
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findOverlappingShow(
    theaterScreenId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Show | null> {
    return this.prisma.show.findFirst({
      where: {
        theaterScreenId,
        startTime: {
          lt: endTime,
        },
        endTime: {
          gt: startTime,
        },
      },
    });
  }
}
