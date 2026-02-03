import { Injectable } from '@nestjs/common';
import { ShowRepository } from '../../../domain/repositories/show.repository';
import { Show, ShowPricingContext } from '../../../domain/entities/show';
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
      },
    });

    if (!show) {
      return null;
    }

    return {
      ...show,
      basePrice: show.basePrice.toNumber(),
    };
  }

  async getPricingContext(showId: string, seatIds: string[]): Promise<ShowPricingContext | null> {
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
}
