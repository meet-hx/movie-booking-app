import { Body, Controller, Post, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDtoRequest } from "./dto/create-user.dto";

@Controller("user")
export class UserController{
    constructor(private userService: UserService){}
}