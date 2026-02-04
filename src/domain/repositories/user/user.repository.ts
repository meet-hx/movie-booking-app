import { User } from '@prisma/client';
import { Prisma } from 'src/generated/prisma/client';

export interface UserRepository {
  findBy(userWhereInput: Prisma.UserWhereUniqueInput): Promise<Omit<User, 'password'>  | null>;
  findByWithAuth(userWhereInput: Prisma.UserWhereUniqueInput): Promise<User| null>;
  exists(userWhereInput: Prisma.UserWhereUniqueInput): Promise<boolean>;
  create(userCreateInput: Prisma.UserCreateInput): Promise<Omit<User, 'password'>>;
}
