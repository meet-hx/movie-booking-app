import { TheaterScreen } from 'src/generated/prisma/client';

export interface TheaterScreenCreateData {
  theaterId: string;
  screenNo: number;
  totalSeats: number;
  isAvailable?: boolean;
}

export type TheaterScreenUpdateData = Partial<TheaterScreenCreateData>;

export interface TheaterScreenRepository {
  findById(id: string): Promise<TheaterScreen | null>;
  exists(id: string): Promise<boolean>;
  findByTheaterId(theaterId: string): Promise<TheaterScreen[]>;
  findByTheaterAndScreenNo(
    theaterId: string,
    screenNo: number,
  ): Promise<TheaterScreen | null>;
  create(data: TheaterScreenCreateData): Promise<TheaterScreen>;
  update(id: string, data: TheaterScreenUpdateData): Promise<TheaterScreen>;
  delete(id: string): Promise<void>;
}
