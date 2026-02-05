import { Injectable } from '@nestjs/common';
import {
  SeatCategoryCreateData,
  SeatCategoryRepository,
  SeatCategoryUpdateData,
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

  async findAll(): Promise<SeatCategory[]> {
    return this.prisma.seatCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        additionalPrice: true,
        theaterScreenId: true,
      },
    });
  }

  async findByTheaterScreenId(
    theaterScreenId: string,
  ): Promise<SeatCategory[]> {
    return this.prisma.seatCategory.findMany({
      where: { theaterScreenId },
      select: {
        id: true,
        name: true,
        description: true,
        additionalPrice: true,
        theaterScreenId: true,
      },
    });
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

  async update(
    id: string,
    data: SeatCategoryUpdateData,
  ): Promise<SeatCategory> {
    return this.prisma.seatCategory.update({
      where: { id },
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

  async delete(id: string): Promise<void> {
    await this.prisma.seatCategory.delete({
      where: { id },
    });
  }
}
