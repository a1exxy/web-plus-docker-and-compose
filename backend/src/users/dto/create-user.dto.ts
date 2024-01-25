import { IsEmail, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateUserDto {
  @Length(2, 30)
  username: string;
  @IsString()
  @IsOptional()
  about?: string;
  @IsUrl()
  @IsOptional()
  avatar?: string;
  @IsEmail()
  email: string;
  @Length(8, 20)
  password: string;
}
