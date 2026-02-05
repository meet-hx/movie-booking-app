import { Injectable } from '@nestjs/common';
import { ScreenSeatRepository } from '../../../domain/repositories/screenSeat/screenSeat.repository';
import { ScreenSeat } from '@prisma/client';
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
}
