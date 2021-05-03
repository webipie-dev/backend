import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../interfaces/product.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { StoreService } from '../store/store.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: SoftDeleteModel<Product>,
    private storeService: StoreService,
  ) {}

  async getAll(): Promise<Product[]> {
    return this.productModel.find();
  }

  async getOneProduct(id: string) {
    return this.productModel.findById(id);
  }

  async addOneProduct(productDTO: CreateProductDto): Promise<Product> {
    const store = await this.storeService.getOneStore(productDTO.storeId);
    if (!store) {
      throw new NotFoundException('Store Not Found');
    }
    const product: Product = await new this.productModel({
      ...productDTO,
      store: productDTO.storeId,
    });

    return await product.save().catch((err) => {
      throw new InternalServerErrorException(err.message);
    });
  }

  // private filterProducts(req) {
  //   const query = {};
  //   for (const propName in req.query) {
  //     if (req.query.hasOwnProperty(propName)) {
  //       if (
  //         [
  //           'name',
  //           'description',
  //           'price',
  //           'quantity',
  //           'popular',
  //           'openReview',
  //           'store',
  //         ].includes(propName)
  //       ) {
  //         query[propName] = req.query[propName];
  //       } else {
  //         if (propName === 'minPrice') {
  //           if (query['price'] === undefined) {
  //             query['price'] = {};
  //           }
  //           query.price['$gt'] = req.query[propName];
  //         } else if (propName === 'maxPrice') {
  //           if (query['price'] === undefined) {
  //             query['price'] = {};
  //           }
  //           query.price['$lt'] = req.query[propName];
  //         } else if (propName === 'minQuantity') {
  //           if (query['quantity'] === undefined) {
  //             query['quantity'] = {};
  //           }
  //           query['quantity']['$gt'] = req.query[propName];
  //         } else if (propName === 'maxQuantity') {
  //           if (query['quantity'] === undefined) {
  //             query['quantity'] = {};
  //           }
  //           query['quantity']['$lt'] = req.query[propName];
  //         }
  //       }
  //     }
  //   }
  //   return query;
  // }
}
