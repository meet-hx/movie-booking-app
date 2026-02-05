import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user/user.repository';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByWithAuth(userWhereInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereInput,
      select: {
        id: true,
        name: true,
        email: true,
        contactNo: true,
        password: true,
      },
    });
  }

  async findBy(userWhereInput: Prisma.UserWhereUniqueInput): Promise<Omit<User, 'password'> | null> {
    return this.prisma.user.findUnique({
      where: userWhereInput,
      select: {
        id: true,
        name: true,
        email: true,
        contactNo: true,
      },
    });
  }

  async exists(userWhereInput: Prisma.UserWhereUniqueInput): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: userWhereInput,
      select: { id: true },
    });

    return Boolean(user);
  }
  
  async create(userCreateInput: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    const user =  await this.prisma.user.create({
      data: userCreateInput,
      select: {
        id: true,
        name: true,
        email: true,
        contactNo: true,
      },
    });
    return user;
  }
}
