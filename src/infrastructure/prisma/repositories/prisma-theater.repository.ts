import { Injectable } from '@nestjs/common';
import { TheaterRepository } from '../../../domain/repositories/theater/theater.repository';
import { Theater } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTheaterRepository implements TheaterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Theater | null> {
    return this.prisma.theater.findUnique({
      where: { id },
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
    });
  }

  async exists(id: string): Promise<boolean> {
    const theater = await this.prisma.theater.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(theater);
  }
}
