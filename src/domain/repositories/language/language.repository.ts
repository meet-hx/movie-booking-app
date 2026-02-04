import { Language } from '@prisma/client';

export interface LanguageRepository {
  findById(id: string): Promise<Language | null>;
  exists(id: string): Promise<boolean>;
}
