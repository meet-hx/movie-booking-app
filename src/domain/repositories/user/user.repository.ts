import { User } from '@prisma/client';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  exists(id: string): Promise<boolean>;
}
