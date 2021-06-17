import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from '../interfaces/store.interface';

@Controller('api/products/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('')
  async getAll(): Promise<Store[]> {
    return await this.storeService.getAllStores();
  }

  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<Store> {
    return await this.storeService.getOneStore(id);
  }

  @Post('')
  async addOne(): Promise<Store> {
    return await this.storeService.addOneStore();
  }

  @Delete('/:id')
  async deleteOne(@Param('id') id: string) {
    return await this.storeService.softDelete({ _id: id });
  }
}
