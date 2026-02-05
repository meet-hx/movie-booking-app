import { Injectable } from '@nestjs/common';
import { TheaterScreenRepository } from '../../../domain/repositories/theaterScreen/theaterScreen.repository';
import { TheaterScreen } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTheaterScreenRepository implements TheaterScreenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<TheaterScreen | null> {
    return this.prisma.theaterScreen.findUnique({
      where: { id },
      select: {
        id: true,
        theaterId: true,
        screenNo: true,
        totalSeats: true,
        isAvailable: true,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const theaterScreen = await this.prisma.theaterScreen.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(theaterScreen);
  }
}
