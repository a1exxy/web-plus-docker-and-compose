import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { OffersService } from "./offers.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { JwtGuard } from "../auth/jwt.guard";

@Controller("offers")
@UseInterceptors(ClassSerializerInterceptor)
export class OffersController {
  constructor(private readonly offerService: OffersService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    return this.offerService.create(createOfferDto, req.user);
  }

  @Get()
  @UseGuards(JwtGuard)
  findAll() {
    return this.offerService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtGuard)
  findOne(@Param("id") id: string) {
    return this.offerService.findOne(+id);
  }
}
