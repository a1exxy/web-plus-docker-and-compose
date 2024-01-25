import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, ILike, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { UserDto } from "./dto/user.dto";
import { Wish } from "../wishes/entities/wish.entity";
import { createHash } from "../utils/crypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      return await this.usersRepository.save({
        ...createUserDto,
        password: createHash(createUserDto.password),
      });
    } catch (err) {
      if (err.code === "23505") {
        throw new ConflictException(
          "Пользователь с таким email или username уже зарегистрирован"
        );
      } else {
        console.error(err);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async findOneById(id: number): Promise<UserDto> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      // relations: { wishes: true },
    });
    if (!user) {
      throw new NotFoundException("Не удалось найти пользователя");
    }
    return user;
  }

  async getUserWishes(id: number): Promise<Array<Wish>> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: { wishes: true },
    });
    if (!user) {
      throw new NotFoundException("Не удалось найти пользователя");
    }
    if (!user.wishes[0]?.id) return [];
    return user.wishes;
  }

  async getWishesByUsername(username: string): Promise<Array<Wish>> {
    const user = await this.usersRepository.findOne({
      where: { username: username },
      relations: { wishes: true },
    });
    if (!user) {
      throw new NotFoundException("Не удалось найти пользователя");
    }
    if (!user.wishes[0]?.id) return [];
    return user.wishes;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    if (updateUserDto.password) {
      updateUserDto.password = createHash(updateUserDto.password);
    }
    await this.usersRepository.update(id, updateUserDto);
    return await this.findOneById(id);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(+id);
  }

  async findManyByNameOrEmail(query: string): Promise<Array<User>> {
    return await this.usersRepository.find({
      where: [
        { email: ILike(`%${query}%`) },
        { username: ILike(`%${query}%`) },
      ],
    });
  }

  async findByName(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username: username },
      relations: { wishes: true },
    });
    console.log("user", user);
    if (!user) {
      throw new NotFoundException("Не удалось найти пользователя");
    }
    return user as User & { wishes: Wish };
  }
}
