import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/ceate-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './interfaces/store.interface';
import { IdParam } from '@webipie/common';
import { UrlParam } from '../QueryParamValidation/UrlParam';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('')
  async getFilteredStores(@Query() query?): Promise<Store[]> {
    return await this.storeService.getFilteredStores(query);
  }

  @Get('/:id')
  async getOneStore(@Param() param: IdParam): Promise<Store> {
    return await this.storeService.getOneStore(param.id);
  }

  @Get('/url/:url')
  async getStoreByUrl(@Param() param: UrlParam): Promise<Store> {
    return (await this.storeService.getFilteredStores({ url: param.url }))[0];
  }

  @Get('/all/urls')
  async getStoreUrls(): Promise<{ url: string }[]> {
    return await this.storeService.getStoreUrls();
  }

  @Get('deleted/all')
  async getDeletedStores(): Promise<Store[]> {
    return await this.storeService.getDeletedStores();
  }

  @Post('')
  async addOneStore(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return await this.storeService.addOneStore(createStoreDto);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('logo'))
  async editOneStore(
    @Param() param: IdParam,
    @Body() updateStoreDto: UpdateStoreDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Store> {
    console.log(file);
    console.log(updateStoreDto);
    return await this.storeService.editOneStore(param.id, updateStoreDto);
  }

  @Delete('/delete')
  async deleteFilteredStores(@Query() query?): Promise<Record<string, unknown>> {
    return await this.storeService.deleteFilteredStores(query);
  }

  @Delete('/delete/:id')
  async deleteStoreById(@Param() param: IdParam): Promise<Store> {
    return await this.storeService.deleteStoreById(param.id);
  }

  @Delete('/:id')
  async softDeleteStoreById(@Param() param: IdParam): Promise<Store> {
    return await this.storeService.softDeleteStoreById(param.id);
  }

  @Get('/restore/:id')
  async restoreStoreById(@Param() param: IdParam): Promise<Store> {
    return await this.storeService.restoreStoreById(param.id);
  }
}
