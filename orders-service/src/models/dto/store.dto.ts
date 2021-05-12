import { IsNotEmpty, IsString } from "class-validator";

export class StoreDto{
  @IsString()
  @IsNotEmpty()
  id: string
}
