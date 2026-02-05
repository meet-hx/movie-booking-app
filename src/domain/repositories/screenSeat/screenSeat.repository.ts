import { ScreenSeat } from '@prisma/client';

export interface ScreenSeatCreateData {
  theaterScreenId: string;
  seatCategoryId: string;
  rowNumber: string;
  seatNumbers: number[];
}

export interface ScreenSeatRepository {
  findById(id: string): Promise<ScreenSeat | null>;
  exists(id: string): Promise<boolean>;
  existsByScreenAndRow(
    theaterScreenId: string,
    rowNumber: string,
  ): Promise<boolean>;
  createMany(data: ScreenSeatCreateData[]): Promise<number>;
}
