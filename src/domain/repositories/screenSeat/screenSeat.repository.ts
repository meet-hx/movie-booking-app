import { ScreenSeat } from '@prisma/client';

export interface ScreenSeatRepository {
  findById(id: string): Promise<ScreenSeat | null>;
  exists(id: string): Promise<boolean>;
}
