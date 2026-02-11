import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import type { SeatCategoryRepository } from '../../domain/repositories/seatCategory/seatCategory.repository';
import { Strings } from '../../utils/strings';
import { TheaterScreenService } from '../theaterScreen/theater-screen.service';
import { CreateSeatCategoryRequestDto } from './dto/create-seat-category.dto';
import { UpdateSeatCategoryRequestDto } from './dto/update-seat-category.dto';

@Injectable()
export class SeatCategoryService {
  constructor(
    @Inject(REPOSITORY_TOKENS.SeatCategoryRepository)
    private readonly seatCategoryRepository: SeatCategoryRepository,
    @Inject(forwardRef(() => TheaterScreenService))
    private readonly theaterScreenService: TheaterScreenService,
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

  async create(request: CreateSeatCategoryRequestDto) {
    await this.theaterScreenService.ensureScreenExists(request.theaterScreenId);

    // Check for duplicate seat category name within the same screen
    const existingCategories =
      await this.seatCategoryRepository.findByTheaterScreenId(
        request.theaterScreenId,
      );
    const duplicateCategory = existingCategories.find(
      (category) => category.name.toLowerCase() === request.name.toLowerCase(),
    );

    if (duplicateCategory) {
      throw new ConflictException(Strings.seatCategory.duplicateName);
    }

    return this.createCategory(request);
  }

  listAll() {
    return this.seatCategoryRepository.findAll();
  }

  async listByScreen(screenId: string) {
    await this.theaterScreenService.ensureScreenExists(screenId);
    return this.seatCategoryRepository.findByTheaterScreenId(screenId);
  }

  async update(request: UpdateSeatCategoryRequestDto) {
    const seatCategory = await this.seatCategoryRepository.findById(request.id);
    if (!seatCategory) {
      throw new NotFoundException(
        Strings.seatCategory.notFound({ id: request.id }),
      );
    }

    if (request.theaterScreenId) {
      await this.theaterScreenService.ensureScreenExists(
        request.theaterScreenId,
      );
    }

    // Check for duplicate seat category name if name is being updated
    if (request.name && request.theaterScreenId) {
      const existingCategories =
        await this.seatCategoryRepository.findByTheaterScreenId(
          request.theaterScreenId,
        );
      const duplicateCategory = existingCategories.find(
        (category) =>
          category.name.toLowerCase() === request.name!.toLowerCase() &&
          category.id !== request.id,
      );

      if (duplicateCategory) {
        throw new ConflictException(Strings.seatCategory.duplicateName);
      }
    }

    return this.seatCategoryRepository.update(request.id, {
      theaterScreenId: request.theaterScreenId,
      name: request.name,
      description: request.description,
      additionalPrice: request.additionalPrice,
    });
  }

  async delete(id: string) {
    const seatCategory = await this.seatCategoryRepository.findById(id);
    if (!seatCategory) {
      throw new NotFoundException(Strings.seatCategory.notFound({ id }));
    }

    await this.seatCategoryRepository.delete(id);
    return { deleted: true };
  }
}
