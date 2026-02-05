import { ScreenSeat } from 'src/generated/prisma/client';

export interface ScreenSeatCreateData {
  theaterScreenId: string;
  seatCategoryId: string;
  rowNumber: string;
  seatNumbers: number[];
}

export type ScreenSeatUpdateData = Partial<ScreenSeatCreateData>;

export interface ScreenSeatRepository {
  findById(id: string): Promise<ScreenSeat | null>;
  exists(id: string): Promise<boolean>;
  findByTheaterScreenId(theaterScreenId: string): Promise<ScreenSeat[]>;
  existsByScreenAndRow(
    theaterScreenId: string,
    rowNumber: string,
  ): Promise<boolean>;
  createMany(data: ScreenSeatCreateData[]): Promise<number>;
  update(id: string, data: ScreenSeatUpdateData): Promise<ScreenSeat>;
  delete(id: string): Promise<void>;
}
