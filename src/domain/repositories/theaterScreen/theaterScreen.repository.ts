import { TheaterScreen } from '@prisma/client';

export interface TheaterScreenRepository {
  findById(id: string): Promise<TheaterScreen | null>;
  exists(id: string): Promise<boolean>;
}
