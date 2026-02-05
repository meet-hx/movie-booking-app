import { SeatCategory } from '@prisma/client';

export interface SeatCategoryCreateData {
  name: string;
  description?: string | null;
  additionalPrice: number;
  theaterScreenId: string;
}

export interface SeatCategoryRepository {
  findById(id: string): Promise<SeatCategory | null>;
  exists(id: string): Promise<boolean>;
  create(data: SeatCategoryCreateData): Promise<SeatCategory>;
}
