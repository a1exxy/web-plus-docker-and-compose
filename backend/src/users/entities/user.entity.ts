import { Column, Entity, OneToMany } from "typeorm";
import { IsEmail, IsNotEmpty, IsUrl, Length } from "class-validator";
import { Wish } from "../../wishes/entities/wish.entity";
import { Wishlist } from "../../wishlists/entities/wishlist.entity";
import { Offer } from "../../offers/entities/offer.entity";
import { Exclude } from "class-transformer";
import { BaseEntity } from "../../utils/baseEntity";

// Схема пользователя
@Entity()
export class User extends BaseEntity {
  // Имя пользователя
  @Column({ unique: true })
  @Length(2, 30)
  username: string;

  // О пользователе
  @Column({ default: "Пока ничего не рассказал о себе" })
  @Length(2, 200)
  about: string;

  // ССылка на аватар
  @Column({ default: "https://i.pravatar.cc/300" })
  @IsUrl()
  avatar: string;

  // email пользователя
  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // пароль
  @Column()
  @IsNotEmpty()
  @Exclude()
  password: string;

  // список желаемых подарков
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  //  содержит список подарков, на которые скидывается пользователь
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  // содержит список вишлистов, которые создал пользователь.
  @OneToMany(() => Wishlist, (wishlist) => wishlist.id)
  wishlists: Wishlist[];
}
