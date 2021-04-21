import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/ceate-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './interfaces/store.interface';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('')
  async getAllStores(): Promise<Store[]> {
    return await this.storeService.getAllStores();
  }

  @Get('/:id')
  async getOneStore(@Param('id') id): Promise<Store> {
    return await this.storeService.getOneStore(id);
  }

  @Get('/url/:url')
  getStoreByUrl(@Param('url') url): string {
    return `store url is: ${url}`;
  }

  @Get('/all/urls')
  getStoreUrls(): string {
    return 'store urls';
  }

  @Post('')
  addOneStore(@Body() createStoreDto: CreateStoreDto): string {
    return `Name: ${createStoreDto.name} templateId: ${createStoreDto.templateId}`;
  }

  @Patch('/:id')
  editOneStore(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ): string {
    return `id: ${id} - updates: ${updateStoreDto}`;
  }

  @Delete('/delete')
  deleteAllStores(): string {
    return 'all stores deleted';
  }
}
