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
import { AddReviewDto } from './dto/add-review.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  async getAll(@Query() query): Promise<Product[]> {
    return await this.productService.getAllProducts();
  }

  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<Product> {
    return await this.productService.getOneProduct(id);
  }

  @Post('')
  async addOne(@Body() productDTO: CreateProductDto): Promise<Product> {
    return await this.productService.addOneProduct(productDTO);
  }

  @Post('review/:id')
  async addReview(
    @Param('id') id: string,
    @Body() reviewDTO: AddReviewDto,
  ): Promise<QueryWithHelpers<any, any>> {
    return await this.productService.addReview(id, reviewDTO);
  }

  @Patch('/:id')
  async editOne(
    @Param('id') id: string,
    @Body() editDTO: EditProductDto,
  ): Promise<mongodb.BulkWriteOpResultObject | void> {
    return await this.productService.editOneProduct(id, editDTO);
  }

  @Delete('/delete/soft/:id')
  async softDeleteProductById(@Param('id') id: string): Promise<number> {
    return await this.productService.softDeleteProductById({ _id: id });
  }

  @Delete('/delete/:id')
  async deleteOne(@Param('id') id: string): Promise<Product> {
    return await this.productService.deleteProductById(id);
  }

  // @Get('/restore/:id')
  // async restoreProductById(@Param() param: IdParam): Promise<Product> {
  //   return await this.productService.restoreProductById(param.id);
  // }

  @Delete('/delete')
  async deleteAll(): Promise<QueryWithHelpers<any, any>> {
    return await this.productService.deleteAllProducts();
  }
}
