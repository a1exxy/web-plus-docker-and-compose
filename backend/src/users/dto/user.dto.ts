import { IsDate, IsEmail, IsNumber, IsString, IsUrl } from "class-validator";

export class UserDto {
  @IsNumber()
  id: number;
  @IsString()
  username: string;
  @IsString()
  about: string;
  @IsUrl()
  avatar: string;
  @IsEmail()
  email: string;
  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
}
