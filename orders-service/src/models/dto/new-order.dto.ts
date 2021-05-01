import { ClientDto } from "./client.dto";
import { ArrayNotEmpty, IsArray, IsDefined, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PaymentMethods } from "../payment-methods.enum";

export class NewOrderDto {
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PaymentMethods)
  paymentMethod: string;

  @IsArray()
  @ArrayNotEmpty()
  products: [{
    id: string,
    orderedQuantity: number
  }
  ];

  @IsDefined()
  client: ClientDto;
}
