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
  findSeatDetailsByIds(
    theaterScreenId: string,
    seatIds: string[],
  ): Promise<
    {
      id: string;
      rowNumber: string;
      seatNumbers: number[];
      seatCategory: {
        id: string;
        name: string;
        additionalPrice: number;
      };
    }[]
  >;
  findByScreenRowAndSeatNumber(
    theaterScreenId: string,
    rowNumber: string,
    seatNumber: number,
  ): Promise<{
    id: string;
    rowNumber: string;
    seatNumber: number;
    seatCategory: {
      id: string;
      name: string;
      additionalPrice: number;
    };
  } | null>;
  existsByScreenAndRow(
    theaterScreenId: string,
    rowNumber: string,
  ): Promise<boolean>;
  createMany(data: ScreenSeatCreateData[]): Promise<number>;
  update(id: string, data: ScreenSeatUpdateData): Promise<ScreenSeat>;
  delete(id: string): Promise<void>;
}
