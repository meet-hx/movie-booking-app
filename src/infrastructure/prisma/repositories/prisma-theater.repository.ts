import { Injectable } from '@nestjs/common';
import {
  TheaterCreateData,
  TheaterRepository,
  TheaterUpdateData,
} from '../../../domain/repositories/theater/theater.repository';
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

  async findAll(): Promise<Theater[]> {
    return this.prisma.theater.findMany({
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

  async create(data: TheaterCreateData): Promise<Theater> {
    return this.prisma.theater.create({
      data,
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

  async update(id: string, data: TheaterUpdateData): Promise<Theater> {
    return this.prisma.theater.update({
      where: { id },
      data,
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

  async delete(id: string): Promise<void> {
    await this.prisma.theater.delete({ where: { id } });
  }
}
