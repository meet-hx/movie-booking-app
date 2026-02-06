import { Injectable } from '@nestjs/common';
import {
  ScreenSeatCreateData,
  ScreenSeatRepository,
  ScreenSeatUpdateData,
} from '../../../domain/repositories/screenSeat/screenSeat.repository';
import { ScreenSeat } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaScreenSeatRepository implements ScreenSeatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ScreenSeat | null> {
    return this.prisma.screenSeat.findUnique({
      where: { id },
      select: {
        id: true,
        theaterScreenId: true,
        seatCategoryId: true,
        rowNumber: true,
        seatNumbers: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const screenSeat = await this.prisma.screenSeat.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(screenSeat);
  }

  async findByTheaterScreenId(theaterScreenId: string): Promise<ScreenSeat[]> {
    return this.prisma.screenSeat.findMany({
      where: { theaterScreenId },
      select: {
        id: true,
        theaterScreenId: true,
        seatCategoryId: true,
        rowNumber: true,
        seatNumbers: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async findByScreenRowAndSeatNumber(
    theaterScreenId: string,
    rowNumber: string,
    seatNumber: number,
  ): Promise<{
    id: string;
    rowNumber: string;
    seatNumber: number;
    seatCategory: {
      id: string;
      name: string;
      additionalPrice: number;
    };
  } | null> {
    const seat = await this.prisma.screenSeat.findFirst({
      where: {
        theaterScreenId,
        rowNumber,
        seatNumbers: { has: seatNumber },
      },
      select: {
        id: true,
        rowNumber: true,
        seatCategory: {
          select: {
            id: true,
            name: true,
            additionalPrice: true,
          },
        },
      },
    });

    if (!seat) {
      return null;
    }

    return {
      id: seat.id,
      rowNumber: seat.rowNumber,
      seatNumber,
      seatCategory: {
        id: seat.seatCategory.id,
        name: seat.seatCategory.name,
        additionalPrice: seat.seatCategory.additionalPrice.toNumber(),
      },
    };
  }

  async existsByScreenAndRow(
    theaterScreenId: string,
    rowNumber: string,
  ): Promise<boolean> {
    const screenSeat = await this.prisma.screenSeat.findFirst({
      where: {
        theaterScreenId,
        rowNumber,
      },
      select: { id: true },
    });

    return Boolean(screenSeat);
  }

  async createMany(data: ScreenSeatCreateData[]): Promise<number> {
    const result = await this.prisma.screenSeat.createMany({
      data,
    });

    return result.count;
  }

  async update(id: string, data: ScreenSeatUpdateData): Promise<ScreenSeat> {
    return this.prisma.screenSeat.update({
      where: { id },
      data,
      select: {
        id: true,
        theaterScreenId: true,
        seatCategoryId: true,
        rowNumber: true,
        seatNumbers: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.screenSeat.delete({
      where: { id },
    });
  }
}
