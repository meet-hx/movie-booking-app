import { Theater } from '@prisma/client';

export interface TheaterRepository {
  findById(id: string): Promise<Theater | null>;
  exists(id: string): Promise<boolean>;
}
