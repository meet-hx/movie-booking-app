import { Injectable } from '@nestjs/common';
import {
  ShowRepository,
  CreateShowData,
  ShowFilters,
  ShowWithDetails,
  SeatAvailabilityData,
} from '../../../domain/repositories/show/show.repository';
import { Show } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaShowRepository implements ShowRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(filters: ShowFilters) {
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

    return where;
  }

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
    const where = this.buildWhere(filters);
    return this.prisma.show.findMany({
      where,
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findByIdWithDetails(id: string): Promise<ShowWithDetails | null> {
    const show = await this.prisma.show.findUnique({
      where: { id },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        movie: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            type: true,
            genre: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        theater: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
            phone: true,
            email: true,
            website: true,
          },
        },
      },
    });

    if (!show) {
      return null;
    }

    return show;
  }

  async findAllWithDetails(filters: ShowFilters): Promise<ShowWithDetails[]> {
    const where = this.buildWhere(filters);

    return this.prisma.show.findMany({
      where,
      orderBy: {
        startTime: 'asc',
      },
      select: {
        startTime: true,
        movie: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            type: true,
            genre: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        theater: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
            phone: true,
            email: true,
            website: true,
          },
        },
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

  async getSeatAvailabilityData(
    showId: string,
  ): Promise<SeatAvailabilityData | null> {
    const show = await this.prisma.show.findUnique({
      where: { id: showId },
      select: {
        theaterScreenId: true,
        basePrice: true,
      },
    });

    if (!show) {
      return null;
    }

    const [allSeats, bookedSeats, seatCategories] = await Promise.all([
      this.prisma.screenSeat.findMany({
        where: { theaterScreenId: show.theaterScreenId },
        select: {
          id: true,
          rowNumber: true,
          seatNumbers: true,
          seatCategoryId: true,
          seatCategory: {
            select: {
              id: true,
              name: true,
              additionalPrice: true,
            },
          },
        },
        orderBy: [{ rowNumber: 'asc' }],
      }),
      this.prisma.bookingSeat.findMany({
        where: {
          booking: {
            showId: showId,
          },
          OR: [
            { bookingStatus: 'CONFIRMED' },
            {
              bookingStatus: 'RESERVED',
              booking: {
                paymentStatus: 'PENDING',
                expiresAt: { gt: new Date() },
              },
            },
          ],
        },
        select: {
          seatId: true,
          seatNumber: true,
          bookingStatus: true,
          booking: {
            select: {
              userId: true,
            },
          },
        },
      }),
      this.prisma.seatCategory.findMany({
        where: { theaterScreenId: show.theaterScreenId },
        select: {
          id: true,
          name: true,
          additionalPrice: true,
        },
      }),
    ]);

    return {
      allSeats: allSeats.map((seat) => ({
        id: seat.id,
        rowNumber: seat.rowNumber,
        seatNumbers: seat.seatNumbers,
        seatCategoryId: seat.seatCategoryId,
        seatCategory: {
          id: seat.seatCategory.id,
          name: seat.seatCategory.name,
          additionalPrice: seat.seatCategory.additionalPrice.toNumber(),
        },
      })),
      bookedSeats: bookedSeats.map((bs) => ({
        seatId: bs.seatId,
        seatNumber: bs.seatNumber,
        userId: bs.booking.userId,
        bookingStatus: bs.bookingStatus,
      })),
      seatCategories: seatCategories.map((category) => ({
        id: category.id,
        name: category.name,
        additionalPrice: category.additionalPrice.toNumber(),
      })),
      basePrice: show.basePrice.toNumber(),
    };
  }
}
