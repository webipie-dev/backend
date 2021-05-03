export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imgs: Array<string>;
  status: string;
  popular: boolean;
  openReview: boolean;
  storeId: string;
}
