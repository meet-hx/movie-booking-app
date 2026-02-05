import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { AddTheaterScreensRequestDto } from './dto/add-theater-screens.dto';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import type { TheaterScreenRepository } from '../../domain/repositories/theaterScreen/theaterScreen.repository';
import { SeatService } from '../seat/seat.service';
import { SeatCategoryService } from '../seatCategory/seat-category.service';
import { TheaterService } from '../theater/theater.service';
import { Strings } from '../../utils/strings';

@Injectable()
export class TheaterScreenService {
  constructor(
    @Inject(REPOSITORY_TOKENS.TheaterScreenRepository)
    private readonly theaterScreenRepository: TheaterScreenRepository,
    private readonly seatService: SeatService,
    private readonly seatCategoryService: SeatCategoryService,
    @Inject(forwardRef(() => TheaterService))
    private readonly theaterService: TheaterService,
  ) {}

  async addScreens(request: AddTheaterScreensRequestDto) {
    await this.theaterService.ensureExists(request.theaterId);

    const screenNumbers = new Set<number>();
    for (const screen of request.screens) {
      if (screenNumbers.has(screen.screenNo)) {
        throw new BadRequestException(
          Strings.theaterScreen.duplicateScreenNo({
            screenNo: screen.screenNo,
          }),
        );
      }
      screenNumbers.add(screen.screenNo);
    }

    const createdScreens = [] as { id: string; screenNo: number }[];

    for (const screen of request.screens) {
      const existingScreen =
        await this.theaterScreenRepository.findByTheaterAndScreenNo(
          request.theaterId,
          screen.screenNo,
        );

      if (existingScreen) {
        throw new BadRequestException(
          Strings.theaterScreen.screenAlreadyExists({
            screenNo: screen.screenNo,
            theaterId: request.theaterId,
          }),
        );
      }

      const createdScreen = await this.theaterScreenRepository.create({
        theaterId: request.theaterId,
        screenNo: screen.screenNo,
        totalSeats: screen.totalSeats,
        isAvailable: screen.isAvailable ?? true,
      });

      createdScreens.push({
        id: createdScreen.id,
        screenNo: createdScreen.screenNo,
      });

      const seatCategories = [] as {
        categoryId: string;
        seats: { rowNumber: string; seatNumbers: number[] }[];
      }[];

      for (const category of screen.seatCategories ?? []) {
        const createdCategory = await this.seatCategoryService.createCategory({
          theaterScreenId: createdScreen.id,
          name: category.name,
          description: category.description,
          additionalPrice: category.additionalPrice,
        });

        seatCategories.push({
          categoryId: createdCategory.id,
          seats: category.seats,
        });
      }

      if (seatCategories.length > 0) {
        await this.seatService.addSeats({
          theaterScreenId: createdScreen.id,
          seatCategories,
        });
      }
    }

    return { createdScreens };
  }

  async ensureScreenExists(id: string) {
    const exists = await this.theaterScreenRepository.exists(id);
    if (!exists) {
      throw new BadRequestException(Strings.theaterScreen.notFound);
    }
  }
}
