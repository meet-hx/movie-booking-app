import { SeatCategory } from '@prisma/client';

export interface SeatCategoryCreateData {
  name: string;
  description?: string | null;
  additionalPrice: number;
  theaterScreenId: string;
}

export type SeatCategoryUpdateData = Partial<SeatCategoryCreateData>;

export interface SeatCategoryRepository {
  findById(id: string): Promise<SeatCategory | null>;
  exists(id: string): Promise<boolean>;
  findAll(): Promise<SeatCategory[]>;
  findByTheaterScreenId(theaterScreenId: string): Promise<SeatCategory[]>;
  create(data: SeatCategoryCreateData): Promise<SeatCategory>;
  update(id: string, data: SeatCategoryUpdateData): Promise<SeatCategory>;
  delete(id: string): Promise<void>;
}
