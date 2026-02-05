import { Injectable } from '@nestjs/common';
import { BookingSeatRepository } from '../../../domain/repositories/bookingSeat/bookingSeat.repository';
import { BookingSeat } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaBookingSeatRepository implements BookingSeatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<BookingSeat | null> {
    return this.prisma.bookingSeat.findUnique({
      where: { id },
      select: {
        id: true,
        bookingId: true,
        seatId: true,
        amount: true,
        bookingStatus: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const bookingSeat = await this.prisma.bookingSeat.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(bookingSeat);
  }
}
