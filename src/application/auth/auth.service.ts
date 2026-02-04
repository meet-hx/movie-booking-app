import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { Bcrypt } from "src/utils/bcrypt";
import { Strings } from "src/utils/strings";
import { SignInDtoResponse } from "./dto/sign-in.dto";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDtoRequest } from "../user/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,  private readonly jwtService: JwtService) {

        }

    async signIn(email: string, password: string): Promise<SignInDtoResponse> {
        const user = await this.userService.findByEmailWithAuth(email);
        if (!user || !Bcrypt.compareSync(password, user.password)) {
            throw new Error(Strings.auth.invalidPassword);
        }
        const {password: _, ...userWithoutPassword} = user;
        const token = this.jwtService.sign({ id: user.id, email: user.email, role: "user" });
        
        return { user: userWithoutPassword, token };
    }

    async signUp(userDto: CreateUserDtoRequest): Promise<SignInDtoResponse> {
        const userExists = await this.userService.findByEmailWithAuth(userDto.email);
        if (userExists) {
            throw new Error(Strings.auth.userAlreadyExists);
        }
        const user = await this.userService.create(userDto);
        const token = this.jwtService.sign({ id: user.id, email: user.email, role: "user" });
        
        return { user: user, token };
    }
}