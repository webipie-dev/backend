import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { CreateProductDto } from './dto/create-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import { AddReviewDto } from './dto/add-review.dto';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;

  const mockProductService = {
    getAllProducts: jest.fn((filters?: Record<string, any>) => {
      return [];
    }),
    getOneProduct: jest.fn((id: string) => {
      return { id };
    }),
    // getDeletedProducts: jest.fn(() => {
    //   return [];
    // }),
    addOneProduct: jest.fn((dto: CreateProductDto) => {
      return {
        name: dto.name,
        id: 'abscdtfe',
      };
    }),
    addReview: jest.fn((id: string, dto: AddReviewDto) => {
      return { id, ...dto };
    }),
    editOneProduct: jest.fn((id: string, dto: EditProductDto) => {
      return { id, ...dto };
    }),
    softDeleteManyProducts: jest.fn((query: Record<string, any>) => {
      return {};
    }),
    deleteProductById: jest.fn((id: string) => {
      return {
        id,
      };
    }),
    softDeleteProductById: jest.fn((id: Record<string, any>) => {
      return id._id;
    }),
    restoreProductById: jest.fn((id: Record<string, any>) => {
      return id;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    })
      .overrideProvider(ProductService)
      .useValue(mockProductService)
      .compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should fetch product by id', async () => {
    const idParam = { id: 'abc' };
    expect(await controller.getOne(idParam)).toEqual({
      id: idParam.id,
    });
    expect(mockProductService.getOneProduct).toHaveBeenCalledWith(idParam.id);
  });

  it('should fetch filtered products', async () => {
    const query = {};
    expect(await controller.getAll(query)).toEqual([]);
    expect(mockProductService.getAllProducts).toHaveBeenCalledWith({});
    expect(await controller.getAll(query)).toEqual([]);
    expect(mockProductService.getAllProducts).toHaveBeenLastCalledWith(query);
  });

  it('should create a product', async () => {
    const createProductDto = {
      storeId: '609a6d5a88cc963ac44df097',
      name: 'ooooo',
      description: 'awel product',
      price: 40,
      quantity: 10,
      imgs: ['iamge', 'image'],
      status: 'disponible',
      popular: true,
      openReview: true,
    };

    expect(await controller.addOne(createProductDto)).toEqual({
      id: expect.any(String),
      name: createProductDto.name,
    });

    expect(mockProductService.addOneProduct).toHaveBeenCalledWith(
      createProductDto,
    );
  });

  it('should edit a product', async () => {
    const editProductDto = {
      name: 'new test',
    };
    const idParam = {
      id: 'abc',
    };
    expect(await controller.editOne(idParam, editProductDto)).toEqual({
      id: idParam.id,
      ...editProductDto,
    });

    expect(mockProductService.editOneProduct).toHaveBeenCalledWith(
      idParam.id,
      editProductDto,
    );
  });

  it('should add a review', async () => {
    const reviewDto = {
      name: 'khra',
      review: 'aaaaaaaaaaaaaaaaaaaaaaaaaaa',
      rating: '5',
      email: 'aaa@gmail.com',
      date: Date.now(),
    };
    const idParam = {
      id: 'abc',
    };
    expect(await controller.addReview(idParam, reviewDto)).toEqual({
      id: idParam.id,
      ...reviewDto,
    });

    expect(mockProductService.addReview).toHaveBeenCalledWith(
      idParam.id,
      reviewDto,
    );
  });

  it('should delete product by id', async () => {
    const idParam = { id: 'abc' };
    expect(await controller.deleteOne(idParam)).toEqual({
      id: idParam.id,
    });
    expect(mockProductService.deleteProductById).toHaveBeenCalledWith(
      idParam.id,
    );
  });

  it('should soft delete product by id', async () => {
    const idParam = { id: 'abc' };
    expect(await controller.softDeleteProductById(idParam)).toEqual(idParam.id);
    expect(mockProductService.softDeleteProductById).toHaveBeenCalledWith({
      _id: idParam.id,
    });
  });

  it('should soft delete many product by ids', async () => {
    const idParam = { ids: ['abc', 'def'] };
    expect(await controller.softDeleteManyProducts(idParam)).toEqual({});
    expect(mockProductService.softDeleteManyProducts).toHaveBeenCalledWith(
      idParam,
    );
  });

  it('should restore a soft deleted product', async () => {
    const idParam = { id: 'abc' };
    expect(await controller.restoreProductById(idParam)).toEqual({
      _id: idParam.id,
    });
    expect(mockProductService.restoreProductById).toHaveBeenCalledWith({
      _id: idParam.id,
    });
  });
});
