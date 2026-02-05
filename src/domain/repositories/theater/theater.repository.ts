import { Theater } from '@prisma/client';

export interface TheaterCreateData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string | null;
}

export type TheaterUpdateData = Partial<TheaterCreateData>;

export interface TheaterRepository {
  findById(id: string): Promise<Theater | null>;
  exists(id: string): Promise<boolean>;
  findAll(): Promise<Theater[]>;
  create(data: TheaterCreateData): Promise<Theater>;
  update(id: string, data: TheaterUpdateData): Promise<Theater>;
  delete(id: string): Promise<void>;
}
