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
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { WishlistsService } from "./wishlists.service";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { JwtGuard } from "../auth/jwt.guard";

@Controller("wishlistlists")
@UseInterceptors(ClassSerializerInterceptor)
export class WishlistsController {
  constructor(private readonly wishlistService: WishlistsService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    return this.wishlistService.create(createWishlistDto, req.user);
  }

  @Get()
  @UseGuards(JwtGuard)
  findAll() {
    return this.wishlistService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtGuard)
  findOne(@Param("id") id: string) {
    return this.wishlistService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(JwtGuard)
  update(
    @Param("id") id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req
  ) {
    return this.wishlistService.updateOne(+id, updateWishlistDto, req.user);
  }
  //
  @Delete(":id")
  @UseGuards(JwtGuard)
  remove(@Param("id") id: string, @Req() req) {
    return this.wishlistService.remove(+id, req.user);
  }
}
