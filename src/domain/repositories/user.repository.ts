import { User } from '../entities/user';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  exists(id: string): Promise<boolean>;
}
