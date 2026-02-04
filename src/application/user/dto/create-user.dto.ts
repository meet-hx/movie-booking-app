import { Prisma, User } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDtoRequest {
    @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
    name: string;

    @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
    email: string;

    @ApiProperty({ example: '1234567890', description: 'The contact number of the user' })
    contactNo: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    password: string;
}

export type CreateUserDtoResponse = Omit<User, 'password'>