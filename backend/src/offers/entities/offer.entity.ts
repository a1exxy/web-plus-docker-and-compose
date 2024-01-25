import { Column, Entity, ManyToOne } from "typeorm";
import { Wish } from "../../wishes/entities/wish.entity";
import { User } from "../../users/entities/user.entity";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";
import { BaseEntity } from "../../utils/baseEntity";

@Entity()
export class Offer extends BaseEntity {
  // содержит id желающего скинуться
  @ManyToOne(() => User, (user) => user.offers)
  @IsNotEmpty()
  user: User; // id юзера

  // содержит ссылку на товар
  @ManyToOne(() => Wish, (wish) => wish.offers)
  @IsNotEmpty()
  item: Wish;

  // сумма заявки, округляется до двух знаков после запятой
  @Column({ type: "decimal", scale: 2 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  // флаг, который определяет показывать ли информацию о скидывающемся в списке
  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
