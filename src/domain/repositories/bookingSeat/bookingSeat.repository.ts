import { BookingSeat } from "@prisma/client";

export interface BookingSeatRepository {
  findById(id: string): Promise<BookingSeat | null>;
  exists(id: string): Promise<boolean>;
}
