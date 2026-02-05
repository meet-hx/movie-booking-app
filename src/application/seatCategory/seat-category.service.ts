import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import type { SeatCategoryRepository } from '../../domain/repositories/seatCategory/seatCategory.repository';
import { Strings } from '../../utils/strings';

@Injectable()
export class SeatCategoryService {
  constructor(
    @Inject(REPOSITORY_TOKENS.SeatCategoryRepository)
    private readonly seatCategoryRepository: SeatCategoryRepository,
  ) {}

  async findById(id: string) {
    const seatCategory = await this.seatCategoryRepository.findById(id);
    if (!seatCategory) {
      throw new NotFoundException(Strings.seatCategory.notFound({ id }));
    }
    return seatCategory;
  }

  createCategory(options: {
    theaterScreenId: string;
    name: string;
    description?: string;
    additionalPrice: number;
  }) {
    return this.seatCategoryRepository.create({
      theaterScreenId: options.theaterScreenId,
      name: options.name,
      description: options.description,
      additionalPrice: options.additionalPrice,
    });
  }
}
