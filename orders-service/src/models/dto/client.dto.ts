import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AddressDto } from "./address.dto";

export class ClientDto {

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  address: AddressDto;
}
