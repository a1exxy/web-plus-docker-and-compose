import { IsArray, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsUrl()
  image: string;
  @IsArray()
  itemsId: number[];
}
