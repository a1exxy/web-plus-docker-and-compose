import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
import { Offer } from "./entities/offer.entity";
import { WishesService } from "../wishes/wishes.service";

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const item = await this.wishesService.findOne(createOfferDto.itemId);
    if (item.owner.id === user.id) {
      throw new ForbiddenException("Запрещено скидываться на свой подарок");
    }
    if (item.price - item.raised < createOfferDto.amount) {
      throw new NotAcceptableException("Взносы превышают стоимость подарка");
    }
    return await this.offerRepository.save({
      ...createOfferDto,
      item,
      user,
    });
  }

  async findAll(): Promise<Array<Offer>> {
    return await this.offerRepository.find({
      relations: { user: true, item: true },
    });
  }

  async findOne(id: number): Promise<Array<Offer>> {
    return await this.offerRepository.find({
      where: { id: id },
      relations: { user: true, item: true },
    });
  }
}
