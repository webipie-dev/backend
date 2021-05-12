import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { OrderStatus } from "../order-status.enum";

export class UpdateOrderDto{
  @IsString()
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: string;
}
