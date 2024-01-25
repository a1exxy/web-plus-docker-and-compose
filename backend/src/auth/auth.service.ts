import { Injectable } from "@nestjs/common";
import { SigninUserDto } from "./dto/signin-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "../users/dto/user.dto";
import { passwdCompare } from "../utils/crypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async validatePassword(signinUserDto: SigninUserDto) {
    const user = await this.usersService.findByName(signinUserDto.username);
    if (user && passwdCompare(signinUserDto.password, user.password)) {
      return user;
    }
    return null;
  }

  auth(user: UserDto) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.SECRET,
      }),
    };
  }
}
