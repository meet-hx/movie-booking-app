import { Injectable } from '@nestjs/common';
import { LanguageRepository } from '../../../domain/repositories/language/language.repository';
import { Language } from 'src/generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaLanguageRepository implements LanguageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Language | null> {
    return this.prisma.language.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const language = await this.prisma.language.findUnique({
      where: { id },
      select: { id: true },
    });

    return Boolean(language);
  }
}
