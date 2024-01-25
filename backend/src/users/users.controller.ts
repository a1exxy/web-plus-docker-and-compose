import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ClassSerializerInterceptor,
  UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtGuard } from "../auth/jwt.guard";

@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get("/me")
  @UseGuards(JwtGuard)
  getMe(@Req() req) {
    return this.userService.findOneById(+req.user.id);
  }

  @Patch("/me")
  @UseGuards(JwtGuard)
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+req.user.id, updateUserDto);
  }

  @Get("/me/wishes")
  @UseGuards(JwtGuard)
  getOwnWishes(@Req() req) {
    return this.userService.getUserWishes(req.user.id);
  }

  @Get(":username")
  @UseGuards(JwtGuard)
  findOne(@Param("username") username: string) {
    return this.userService.findByName(username);
  }

  @Get(":username/wishes")
  @UseGuards(JwtGuard)
  getWishes(@Param("username") username: string) {
    return this.userService.getWishesByUsername(username);
  }

  // поиск по username или email
  @Post("find")
  @UseGuards(JwtGuard)
  findMany(@Body("query") query: string) {
    return this.userService.findManyByNameOrEmail(query);
  }

  @Delete()
  @UseGuards(JwtGuard)
  deleteUser(@Req() req) {
    return this.userService.remove(+req.user.id);
  }
}
