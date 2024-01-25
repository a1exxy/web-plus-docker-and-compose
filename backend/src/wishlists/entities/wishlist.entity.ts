import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { IsUrl, Length } from "class-validator";
import { Wish } from "../../wishes/entities/wish.entity";
import { User } from "../../users/entities/user.entity";
import { BaseEntity } from "../../utils/baseEntity";

// Cхема списка подарков
@Entity()
export class Wishlist extends BaseEntity {
  // название списка. Не может быть длиннее 250 символов и короче одного
  @Column()
  @Length(1, 250)
  name: string;

  // описание подборки, строка до 1500 символов
  @Column({ default: "" })
  @Length(0, 1500)
  description: string;

  // обложка для подборки
  @Column()
  @IsUrl()
  image: string;

  // содержит набор ссылок на подарки
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  // Создатель виш листа
  @ManyToOne(() => User)
  owner: User;
}
