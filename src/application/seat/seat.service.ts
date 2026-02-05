import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AddSeatsRequestDto } from './dto/add-seats.dto';
import { SeatCategoryService } from '../seatCategory/seat-category.service';
import { TheaterScreenService } from '../theaterScreen/theater-screen.service';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import type { ScreenSeatRepository } from '../../domain/repositories/screenSeat/screenSeat.repository';

@Injectable()
export class SeatService {
  constructor(
    @Inject(REPOSITORY_TOKENS.ScreenSeatRepository)
    private readonly screenSeatRepository: ScreenSeatRepository,
    private readonly seatCategoryService: SeatCategoryService,
    @Inject(forwardRef(() => TheaterScreenService))
    private readonly theaterScreenService: TheaterScreenService,
  ) {}

  async addSeats(request: AddSeatsRequestDto): Promise<{ created: number }> {
    await this.theaterScreenService.ensureScreenExists(request.theaterScreenId);

    const seatRows = [] as {
      theaterScreenId: string;
      seatCategoryId: string;
      rowNumber: string;
      seatNumbers: number[];
    }[];

    for (const category of request.seatCategories) {
      const seatCategory = await this.seatCategoryService.findById(
        category.categoryId,
      );

      if (seatCategory.theaterScreenId !== request.theaterScreenId) {
        throw new BadRequestException(
          `Seat category ${category.categoryId} does not belong to screen ${request.theaterScreenId}.`,
        );
      }

      for (const seatRow of category.seats) {
        seatRows.push({
          theaterScreenId: request.theaterScreenId,
          seatCategoryId: category.categoryId,
          rowNumber: seatRow.rowNumber,
          seatNumbers: seatRow.seatNumbers,
        });
      }
    }

    if (seatRows.length === 0) {
      return { created: 0 };
    }

    const created = await this.screenSeatRepository.createMany(seatRows);
    return { created };
  }
}
