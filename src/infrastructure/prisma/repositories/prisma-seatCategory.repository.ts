import { Injectable } from '@nestjs/common';
import {
  SeatCategoryCreateData,
  SeatCategoryRepository,
} from '../../../domain/repositories/seatCategory/seatCategory.repository';
import { SeatCategory } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaSeatCategoryRepository implements SeatCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<SeatCategory | null> {
    return this.prisma.seatCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        additionalPrice: true,
        theaterScreenId: true,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const seatCategory = await this.prisma.seatCategory.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(seatCategory);
  }

  async create(data: SeatCategoryCreateData): Promise<SeatCategory> {
    return this.prisma.seatCategory.create({
      data,
      select: {
        id: true,
        name: true,
        description: true,
        additionalPrice: true,
        theaterScreenId: true,
      },
    });
  }
}
