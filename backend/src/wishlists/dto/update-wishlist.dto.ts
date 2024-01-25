import { IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateWishlistDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsUrl()
  @IsOptional()
  image?: string;
  @IsNumber()
  @IsOptional()
  itemsId?: number[];
}
