import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { FindOptionsOrder, Repository } from "typeorm";
import { Wish } from "./entities/wish.entity";

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>
  ) {}

  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    return await this.wishRepository.save({ owner, ...createWishDto });
  }

  async findAll(): Promise<Array<Wish>> {
    return await this.wishRepository.find({
      relations: ["owner", "offers", "offers.user"],
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: ["owner", "offers", "offers.user"],
    });
    if (!wish) {
      throw new NotFoundException("Не удалось найти подарок");
    }
    return {
      ...wish,
      offers: wish.offers.filter((item) => item.hidden === false),
    };
  }

  async findAndOrder(
    order: FindOptionsOrder<Wish>,
    limit: number
  ): Promise<Array<Wish>> {
    return await this.wishRepository.find({
      relations: ["owner", "offers", "offers.user"],
      order: order,
      take: limit,
    });
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    owner: User
  ): Promise<void> {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: { owner: true },
    });
    if (!wish) {
      throw new NotFoundException("Не удалось найти подарок");
    }
    if (
      wish.owner.id !== owner.id ||
      (updateWishDto.price && wish.offers.length > 0)
    ) {
      throw new NotAcceptableException("Нет возмоности изменить");
    }
    await this.wishRepository.update(id, updateWishDto);
  }

  async remove(id: number, owner: User): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: { owner: true, offers: true },
    });
    if (!wish) {
      throw new NotFoundException("Не удалось найти подарок");
    }
    if (wish.offers?.length > 0 || wish.owner.id !== owner.id) {
      throw new BadRequestException("Не возможно удалить");
    }
    return await this.wishRepository.remove(wish);
  }

  async copy(id: number, owner: User): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
    });
    if (!wish) {
      throw new NotFoundException("Не удалось найти подарок");
    }
    await this.wishRepository.update(
      { id: wish.id },
      { copied: wish.copied + 1 }
    );
    wish.owner = owner;
    delete wish.id;
    delete wish.copied;
    return await this.wishRepository.save(wish);
  }
}
