import { User } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class SignInDtoRequest {
    @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    password: string;
}

export class SignInDtoResponse {
    @ApiProperty({ description: 'The user details excluding password' })
    user: Omit<User, 'password'>;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT Access Token' })
    token: string;
}