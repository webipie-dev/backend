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
import { EditProductDto } from './dto/edit-product.dto';
import mongodb from 'mongodb';
import { QueryWithHelpers } from 'mongoose';
import { AddReviewDto } from './dto/add-review.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: SoftDeleteModel<Product>,
    private storeService: StoreService,
  ) {}

  async getAllProducts(query): Promise<Product[]> {
    const q = this.filterProducts(query);
    return this.productModel.find(q);
  }

  async getOneProduct(id: string): Promise<Product> {
    return this.productModel.findById(id);
  }

  async addOneProduct(productDTO: CreateProductDto): Promise<Product> {
    const store = await this.storeService.getOneStore(productDTO.storeId);
    if (!store) {
      throw new NotFoundException('Store Not Found');
    }

    if (productDTO.quantity <= 0) {
      productDTO.quantity = 0;
      productDTO.status = 'out of stock';
    }
    const product: Product = await new this.productModel({
      ...productDTO,
      store: productDTO.storeId,
    });

    return await product.save().catch((err) => {
      throw new InternalServerErrorException(err.message);
    });
  }

  async editOneProduct(
    id: string,
    editDTO: EditProductDto,
  ): Promise<mongodb.BulkWriteOpResultObject | void> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    const { imgs, deletedImages } = editDTO;

    //separating the updates
    const edits = {};
    for (const key in editDTO) {
      if (key !== 'imgs' && key !== 'deletedImages') {
        edits[key] = editDTO[key];
      }
    }

    const bulkQueries = [];
    // regular edits
    await bulkQueries.push({
      updateOne: {
        filter: { _id: id },
        update: { $set: edits },
      },
    });
    // adding images
    await bulkQueries.push({
      updateOne: {
        filter: { _id: id },
        update: { $addToSet: { imgs: { $each: imgs } } },
      },
    });
    // deleting images
    await bulkQueries.push({
      updateOne: {
        filter: { _id: id },
        update: { $pull: { imgs: { $in: deletedImages } } },
      },
    });

    // applying edits
    const productEdited = await this.productModel
      .bulkWrite(bulkQueries, {
        ordered: false,
      })
      .catch((err) => {
        throw new InternalServerErrorException(err.message);
      });

    // set status to out of stock if quantity is 0
    await this.productModel
      .updateMany({ quantity: { $lte: 0 } }, { status: 'out of stock' })
      .catch((err) => {
        throw new InternalServerErrorException(err.message);
      });

    // set status to disponible if quantity is > 0
    await this.productModel
      .updateMany({ quantity: { $gt: 0 } }, { status: 'disponible' })
      .catch((err) => {
        throw new InternalServerErrorException(err.message);
      });

    return productEdited;
  }

  async addReview(
    id: string,
    reviewDTO: AddReviewDto,
  ): Promise<QueryWithHelpers<any, any>> {
    // add time to review
    reviewDTO.date = Date.now();

    const productUpdate = await this.productModel
      .updateOne({ _id: id }, { $push: { reviews: reviewDTO } })
      .catch((err) => {
        throw new InternalServerErrorException(err.message);
      });

    return productUpdate;
  }

  async deleteProductById(id: string): Promise<Product> {
    return this.productModel.findByIdAndDelete(id);
  }

  async softDeleteManyProducts(query: Record<string, any>): Promise<number> {
    console.log(query);
    return this.productModel.softDelete({ _id: { $in: query.ids } });
  }

  async softDeleteProductById(query: Record<string, any>): Promise<number> {
    return this.productModel.softDelete(query);
  }

  async restoreProductById(query: Record<string, any>): Promise<number> {
    return this.productModel.restore(query);
  }

  async deleteAllProducts(): Promise<QueryWithHelpers<any, any>> {
    return this.productModel.deleteMany();
  }

  private filterProducts(req) {
    const query = {};
    for (const propName in req) {
      if (req.hasOwnProperty(propName)) {
        if (
          [
            'name',
            'description',
            'price',
            'quantity',
            'popular',
            'openReview',
            'store',
          ].includes(propName)
        ) {
          query[propName] = req[propName];
        } else {
          if (propName === 'minPrice') {
            if (query['price'] === undefined) {
              query['price'] = {};
            }
            query['price']['$gt'] = req[propName];
          } else if (propName === 'maxPrice') {
            if (query['price'] === undefined) {
              query['price'] = {};
            }
            query['price']['$lt'] = req[propName];
          } else if (propName === 'minQuantity') {
            if (query['quantity'] === undefined) {
              query['quantity'] = {};
            }
            query['quantity']['$gt'] = req[propName];
          } else if (propName === 'maxQuantity') {
            if (query['quantity'] === undefined) {
              query['quantity'] = {};
            }
            query['quantity']['$lt'] = req[propName];
          }
        }
      }
    }
    return query;
  }
}
