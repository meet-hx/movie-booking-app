import { TheaterScreen } from '@prisma/client';

export interface TheaterScreenCreateData {
  theaterId: string;
  screenNo: number;
  totalSeats: number;
  isAvailable?: boolean;
}

export interface TheaterScreenRepository {
  findById(id: string): Promise<TheaterScreen | null>;
  exists(id: string): Promise<boolean>;
  findByTheaterAndScreenNo(
    theaterId: string,
    screenNo: number,
  ): Promise<TheaterScreen | null>;
  create(data: TheaterScreenCreateData): Promise<TheaterScreen>;
}
