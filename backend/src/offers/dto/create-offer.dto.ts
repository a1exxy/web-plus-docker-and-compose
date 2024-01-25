import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class CreateOfferDto {
  @IsNumber()
  itemId: number;
  @IsNumber()
  amount: number;
  @IsBoolean()
  @IsOptional()
  hidden?: boolean;
}
