import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { WishesService } from "./wishes.service";
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { JwtGuard } from "../auth/jwt.guard";
import { defaultLastLimit, defaultTopLimit } from "../utils/consts";

@Controller("wishes")
@UseInterceptors(ClassSerializerInterceptor)
export class WishesController {
  constructor(private readonly wishService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishService.create(req.user, createWishDto);
  }

  @Get("last")
  findLast() {
    return this.wishService.findAndOrder(
      { createdAt: "DESC" },
      defaultLastLimit
    );
  }
  @Get("top")
  findTop() {
    return this.wishService.findAndOrder({ copied: "DESC" }, defaultTopLimit);
  }

  @Get("all")
  getAll() {
    return this.wishService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.wishService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(JwtGuard)
  update(
    @Param("id") id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req
  ) {
    return this.wishService.update(+id, updateWishDto, req.user);
  }

  @Delete(":id")
  @UseGuards(JwtGuard)
  removeOne(@Param("id") id: string, @Req() req) {
    return this.wishService.remove(+id, req.user);
  }

  @Post(":id/copy")
  @UseGuards(JwtGuard)
  copy(@Param("id") id: number, @Req() req) {
    return this.wishService.copy(id, req.user);
  }
}
