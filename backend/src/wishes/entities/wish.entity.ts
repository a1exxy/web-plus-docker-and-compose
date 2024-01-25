import { Column, Entity, ManyToOne, OneToMany, VirtualColumn } from "typeorm";
import { IsNotEmpty, IsNumber, IsUrl, Length } from "class-validator";
import { User } from "../../users/entities/user.entity";
import { Offer } from "../../offers/entities/offer.entity";
import { BaseEntity } from "../../utils/baseEntity";

// Схема для подарков
@Entity()
export class Wish extends BaseEntity {
  // название подарка
  @Column()
  @Length(1, 250)
  name: string;

  // ссылка на интернет-магазин, в котором можно приобрести подарок
  @Column()
  @IsUrl()
  @IsNotEmpty()
  link: string;

  // ссылка на изображение подарка
  @Column()
  @IsUrl()
  @IsNotEmpty()
  image: string;

  // стоимость подарка, с округлением до сотых
  @Column({ type: "decimal", scale: 2 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  // сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок
  @VirtualColumn({
    query: (alias) =>
      `select coalesce(sum(amount),0) from offer where "itemId" = ${alias}.id`,
    type: "decimal",
  })
  raised: number;

  // ссылка на пользователя, который добавил пожелание подарка
  @ManyToOne(() => User, (user) => user.wishes)
  @IsNotEmpty()
  owner: User;

  // строка с описанием подарка длиной от 1 и до 1024 символов
  @Column()
  @Length(1, 1024)
  description: string;

  // массив ссылок на заявки скинуться от других пользователей
  @OneToMany(() => Offer, (offer) => offer.item)
  @IsNotEmpty()
  offers: Offer[];

  // содержит cчётчик тех, кто скопировал подарок себе
  @Column({ default: 0 })
  @IsNumber()
  copied: number;
}
