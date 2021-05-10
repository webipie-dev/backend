import { StoreDto } from './store-dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateStoreDto extends PartialType(StoreDto) {}
