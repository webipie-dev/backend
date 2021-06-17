import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import mongodb from 'mongodb';
import { QueryWithHelpers } from 'mongoose';
import { IdParam } from '@webipie/common';
import { AddReviewDto } from './dto/add-review.dto';

@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}


  @Get('')
  async getAll(@Query() query): Promise<Product[]> {
    return await this.productService.getAllProducts(query);
  }

  @Get('emit')
  emit() {
    this.productService.emit();
  }

  @Get('/:id')
  async getOne(@Param() param: IdParam): Promise<Product> {
    return await this.productService.getOneProduct(param.id);
  }

  @Post('')
  async addOne(@Body() productDTO: CreateProductDto): Promise<Product> {
    return await this.productService.addOneProduct(productDTO);
  }

  @Post('review/:id')
  async addReview(
    @Param() param: IdParam,
    @Body() reviewDTO: AddReviewDto,
  ): Promise<QueryWithHelpers<any, any>> {
    return await this.productService.addReview(param.id, reviewDTO);
  }

  @Patch('/:id')
  async editOne(
    @Param() param: IdParam,
    @Body() editDTO: EditProductDto,
  ): Promise<mongodb.BulkWriteOpResultObject | void> {
    return await this.productService.editOneProduct(param.id, editDTO);
  }

  @Delete('/delete/soft/:id')
  async softDeleteProductById(@Param() param: IdParam) {
    return await this.productService.softDeleteProductById({ _id: param.id });
  }

  @Delete('/delete/many')
  async softDeleteManyProducts(@Body() ids: Record<string, any>) {
    return await this.productService.softDeleteManyProducts(ids);
  }

  @Delete('/delete/:id')
  async deleteOne(@Param() param: IdParam): Promise<Product> {
    return await this.productService.deleteProductById(param.id);
  }

  @Get('/restore/:id')
  async restoreProductById(@Param() param: IdParam) {
    return await this.productService.restoreProductById({ _id: param.id });
  }

  @Delete('/delete')
  async deleteAll(): Promise<QueryWithHelpers<any, any>> {
    return await this.productService.deleteAllProducts();
  }
}
