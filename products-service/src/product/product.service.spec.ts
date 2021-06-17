import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from '../interfaces/product.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { StoreService } from '../store/store.service';
import { ProductSchema } from '../schemas/product.schema';
import { NotFoundException } from '@nestjs/common';
import { Store } from '../interfaces/store.interface';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from '../schemas/store.schema';
import { rootMongooseTestModule } from '../mongoose-mock';
import * as mongoose from 'mongoose';
import { closeInMongodConnection } from '../../../stores-service/src/mongoose-mock';

describe('ProductService', () => {
  let service: ProductService;
  let productModel: SoftDeleteModel<Product>;
  let storeService: StoreService;
  let storeModel: SoftDeleteModel<Store>;

  const createProductDto = {
    storeId: mongoose.Types.ObjectId().toHexString(),
    name: 'ooooo',
    description: 'awel product',
    price: 40,
    quantity: 10,
    imgs: ['iamge', 'image'],
    status: 'disponible',
    popular: true,
    openReview: true,
  };

  const createStoreDto = {
    name: 'store',
  };

  const storeId = async () => {
    const store = await storeService.addOneStore();
    return store.id;
  };

  const createProduct = async () => {
    createProductDto.storeId = await storeId();
    return await service.addOneProduct(createProductDto);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Store', schema: StoreSchema },
          { name: 'Product', schema: ProductSchema },
        ]),
      ],
      providers: [ProductService, StoreService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    storeService = module.get<StoreService>(StoreService);
    productModel = module.get<SoftDeleteModel<Product>>('ProductModel');
    storeModel = module.get<SoftDeleteModel<Store>>('StoreModel');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error when inserting an erroneous store id', async () => {
    try {
      await service.addOneProduct(createProductDto);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toEqual('Store Not Found');
    }
  });

  it('should create a product', async () => {
    const product = await createProduct();
    expect(product.isDeleted).toEqual(false);
    expect(product.deletedAt).toEqual(null);
  });

  it('should fetch only available products', async () => {
    createProductDto.storeId = await storeId();
    await service.addOneProduct(createProductDto);
    const product = await service.addOneProduct(createProductDto);

    await service.softDeleteProductById({ _id: product.id });

    const products = await service.getAllProducts({});
    expect(products).toBeDefined();
    expect(products).toHaveLength(1);
  });

  it('should fetch a product if exists, null if not', async () => {
    const product = await createProduct();
    expect(await service.getOneProduct(product.id)).toBeDefined();
    const id = new mongoose.Types.ObjectId().toHexString();
    expect(await service.getOneProduct(id)).toBeNull();
  });

  it('should update a store', async () => {
    const product = await createProduct();
    await service.editOneProduct(product.id, {
      name: 'new name',
      imgs: [],
    });
    const newProduct = await service.getOneProduct(product.id);
    expect(newProduct.name).toEqual('new name');
  });

  it("should delete a product by id and return null if product doesn't exist", async () => {
    const product = await createProduct();
    await service.deleteProductById(product.id);
    const id = new mongoose.Types.ObjectId().toHexString();
    expect(await service.deleteProductById(id)).toBeNull();
  });

  it('should soft delete a product by id', async () => {
    const product = await createProduct();
    const softDeletedProduct = await service.softDeleteProductById({
      _id: product.id,
    });
    expect(softDeletedProduct.deleted).toEqual(1);
  });

  it('should return null when soft deleting a non existing product', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const product = await service.softDeleteProductById({ _id: id });
    expect(product.deleted).toEqual(0);
  });

  it('should restore a soft deleted product', async () => {
    const product = await createProduct();
    await service.softDeleteProductById({ _id: product.id });
    const restoredProduct = await service.restoreProductById({
      _id: product.id,
    });
    expect(restoredProduct.restored).toEqual(1);
  });

  it('should add a review', async () => {
    const product = await createProduct();
    const review = {
      name: 'khra',
      review: 'aaaaaaaaaaaaaaaaaaaaaaaaaaa',
      rating: '5',
      email: 'aaa@gmail.com',
      date: Date.now(),
    };
    await service.addReview(product.id, review);
    const newProd = await service.getOneProduct(product.id);
    expect(newProd.reviews[0].name).toEqual('khra');

  });

  afterEach(async () => {
    await storeModel.deleteMany({});
    await productModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
