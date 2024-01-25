import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Wishlist } from "./entities/wishlist.entity";
import { User } from "../users/entities/user.entity";
import { WishesService } from "../wishes/wishes.service";

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishListRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    owner: User
  ): Promise<Wishlist> {
    const items = [];
    for (const id of createWishlistDto.itemsId) {
      items.push(await this.wishesService.findOne(id));
    }
    return await this.wishListRepository.save({
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      description: createWishlistDto.description,
      owner,
      items,
    });
  }

  async findAll(): Promise<Array<Wishlist>> {
    return await this.wishListRepository.find({
      relations: { items: true, owner: true },
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishList = await this.wishListRepository.findOne({
      where: { id: id },
      relations: { items: true, owner: true },
    });
    if (!wishList) {
      throw new NotFoundException("Список не найден");
    }
    return wishList;
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User
  ): Promise<Wishlist> {
    const wishlist = await this.wishListRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    if (user.id !== wishlist.owner.id) {
      throw new BadRequestException("Не возможно обновить список");
    }
    const items = [];
    if (updateWishlistDto.itemsId) {
      for (const id of updateWishlistDto.itemsId) {
        items.push(await this.wishesService.findOne(id));
      }
    }
    return await this.wishListRepository.save({
      id,
      ...updateWishlistDto,
      items: items.length > 0 ? items : wishlist.items,
    });
  }

  async remove(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.wishListRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (user.id !== wishlist.owner.id) {
      throw new BadRequestException("Не возможно удалить список");
    }
    return await this.wishListRepository.remove(wishlist);
  }
}
