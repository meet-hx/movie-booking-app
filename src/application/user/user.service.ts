import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from 'src/domain/repositories/user/user.repository';
import { REPOSITORY_TOKENS } from 'src/infrastructure/persistence/tokens';
import {
  CreateUserDtoRequest,
  CreateUserDtoResponse,
} from './dto/create-user.dto';
import { Bcrypt } from 'src/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORY_TOKENS.UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  findById(id: string) {
    return this.userRepository.findBy({ id });
  }

  findByEmailWithAuth(email: string) {
    return this.userRepository.findByWithAuth({ email });
  }

  findByEmailOrContact(email: string, contactNo?: string) {
    return this.userRepository.findByEmailOrContact(email, contactNo);
  }

  create(user: CreateUserDtoRequest): Promise<CreateUserDtoResponse> {
    return this.userRepository.create({
      name: user.name,
      email: user.email,
      password: Bcrypt.hashSync(user.password),
      contactNo: user.contactNo,
    });
  }
}
