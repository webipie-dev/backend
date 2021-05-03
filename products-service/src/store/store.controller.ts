import { Controller, Get, Post, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from '../interfaces/store.interface';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('')
  async getAll(): Promise<Store[]> {
    return await this.storeService.getAllProducts();
  }

  @Get('/:id')
  async getOne(@Query() id: string): Promise<Store> {
    return await this.storeService.getOneStore(id);
  }

  @Post('')
  async addOne(): Promise<Store> {
    return await this.storeService.addOneStore();
  }
}
