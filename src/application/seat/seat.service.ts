import {
  Injectable,
  BadRequestException,
  Inject,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { AddSeatsRequestDto } from './dto/add-seats.dto';
import { SeatCategoryService } from '../seatCategory/seat-category.service';
import { TheaterScreenService } from '../theaterScreen/theater-screen.service';
import { REPOSITORY_TOKENS } from '../../infrastructure/persistence/tokens';
import type { ScreenSeatRepository } from '../../domain/repositories/screenSeat/screenSeat.repository';
import { Strings } from '../../utils/strings';
import { UpdateScreenSeatRequestDto } from './dto/update-screen-seat.dto';

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
          Strings.seatCategory.mismatch({
            categoryId: category.categoryId,
            theaterScreenId: request.theaterScreenId,
          }),
        );
      }

      for (const seatRow of category.seats) {
        if (
          await this.screenSeatRepository.existsByScreenAndRow(
            request.theaterScreenId,
            seatRow.rowNumber,
          )
        ) {
          throw new BadRequestException(
            Strings.screenSeat.duplicateRowNumber({
              rowNumber: seatRow.rowNumber,
            }),
          );
        }

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

  async getSeat(id: string) {
    const seat = await this.screenSeatRepository.findById(id);
    if (!seat) {
      throw new NotFoundException(Strings.screenSeat.notFound);
    }
    return seat;
  }

  async listSeatsByScreen(theaterScreenId: string) {
    await this.theaterScreenService.ensureScreenExists(theaterScreenId);
    return this.screenSeatRepository.findByTheaterScreenId(theaterScreenId);
  }

  async updateSeat(id: string, request: UpdateScreenSeatRequestDto) {
    const seat = await this.screenSeatRepository.findById(id);
    if (!seat) {
      throw new NotFoundException(Strings.screenSeat.notFound);
    }

    const targetTheaterScreenId =
      request.theaterScreenId ?? seat.theaterScreenId;
    const targetRowNumber = request.rowNumber ?? seat.rowNumber;

    if (request.theaterScreenId) {
      await this.theaterScreenService.ensureScreenExists(
        request.theaterScreenId,
      );
    }

    if (request.seatCategoryId) {
      const seatCategory = await this.seatCategoryService.findById(
        request.seatCategoryId,
      );
      if (seatCategory.theaterScreenId !== targetTheaterScreenId) {
        throw new BadRequestException(
          Strings.seatCategory.mismatch({
            categoryId: request.seatCategoryId,
            theaterScreenId: targetTheaterScreenId,
          }),
        );
      }
    }

    if (
      request.theaterScreenId &&
      request.theaterScreenId !== seat.theaterScreenId &&
      !request.seatCategoryId
    ) {
      const seatCategory = await this.seatCategoryService.findById(
        seat.seatCategoryId,
      );
      if (seatCategory.theaterScreenId !== request.theaterScreenId) {
        throw new BadRequestException(
          Strings.seatCategory.mismatch({
            categoryId: seat.seatCategoryId,
            theaterScreenId: request.theaterScreenId,
          }),
        );
      }
    }

    if (
      targetTheaterScreenId !== seat.theaterScreenId ||
      targetRowNumber !== seat.rowNumber
    ) {
      if (
        await this.screenSeatRepository.existsByScreenAndRow(
          targetTheaterScreenId,
          targetRowNumber,
        )
      ) {
        throw new BadRequestException(
          Strings.screenSeat.duplicateRowNumber({
            rowNumber: targetRowNumber,
          }),
        );
      }
    }

    return this.screenSeatRepository.update(id, request);
  }

  async deleteSeat(id: string) {
    const seat = await this.screenSeatRepository.findById(id);
    if (!seat) {
      throw new NotFoundException(Strings.screenSeat.notFound);
    }

    await this.screenSeatRepository.delete(id);
    return { deleted: true };
  }
}
