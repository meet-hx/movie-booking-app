import { SeatCategory } from '@prisma/client';

export interface SeatCategoryRepository {
  findById(id: string): Promise<SeatCategory | null>;
  exists(id: string): Promise<boolean>;
}
