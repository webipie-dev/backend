import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/ceate-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

describe('StoreController', () => {
  let controller: StoreController;
  const mockStoreService = {
    getFilteredStores: jest.fn((filters?: Record<string, any>) => {
      return [];
    }),
    getOneStore: jest.fn((id: string) => {
      return { id };
    }),
    getStoreUrls: jest.fn(() => {
      return [];
    }),
    getDeletedStores: jest.fn(() => {
      return [];
    }),
    addOneStore: jest.fn((dto: CreateStoreDto) => {
      return {
        name: dto.name,
        id: 'abscdtfe',
      };
    }),
    editOneStore: jest.fn((id: string, dto: UpdateStoreDto) => {
      return { id, ...dto };
    }),
    deleteFilteredStores: jest.fn((filters?: Record<string, any>) => {
      return {};
    }),
    deleteStoreById: jest.fn((id: string) => {
      return {
        id,
      };
    }),
    softDeleteStoreById: jest.fn((id: string) => {
      return {
        id,
      };
    }),
    restoreStoreById: jest.fn((id: string) => {
      return { id };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [StoreService],
    })
      .overrideProvider(StoreService)
      .useValue(mockStoreService)
      .compile();

    controller = module.get<StoreController>(StoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should fetch store by id', async () => {
    const idParam = { id: 'abc' };
    expect(await controller.getOneStore(idParam)).toEqual({
      id: idParam.id,
    });
    expect(mockStoreService.getOneStore).toHaveBeenCalledWith(idParam.id);
  });

  it('should fetch store by url', async () => {
    const urlParam = { url: 'webipie.com' };
    const empty = [];
    expect(await controller.getStoreByUrl(urlParam)).toEqual(empty[0]);
    expect(mockStoreService.getFilteredStores).toHaveBeenCalledWith({
      url: urlParam.url,
    });
  });

  it('should fetch stores urls', async () => {
    expect(await controller.getStoreUrls()).toEqual([]);
    expect(mockStoreService.getStoreUrls).toHaveBeenCalledWith();
  });

  it('should fetch filtered stores', async () => {
    const query = {};
    expect(await controller.getFilteredStores()).toEqual([]);
    expect(mockStoreService.getFilteredStores).toHaveBeenCalledWith(undefined);
    expect(await controller.getFilteredStores(query)).toEqual([]);
    expect(mockStoreService.getFilteredStores).toHaveBeenLastCalledWith(query);
  });

  it('should fetch deleted stores', async () => {
    expect(await controller.getDeletedStores()).toEqual([]);
    expect(mockStoreService.getDeletedStores).toHaveBeenCalledWith();
  });

  it('should create a store', async () => {
    const createStoreDto = {
      name: 'store test',
      type: 'test',
      template: 'abc',
    };

    expect(await controller.addOneStore(createStoreDto)).toEqual({
      id: expect.any(String),
      name: createStoreDto.name,
    });

    expect(mockStoreService.addOneStore).toHaveBeenCalledWith(createStoreDto);
  });

  it('should edit a store', async () => {
    const updateStoreDto = {
      name: 'new test',
    };
    const idParam = {
      id: 'abc',
    };
    expect(await controller.editOneStore(idParam, updateStoreDto)).toEqual({
      id: idParam.id,
      ...updateStoreDto,
    });

    expect(mockStoreService.editOneStore).toHaveBeenCalledWith(
      idParam.id,
      updateStoreDto,
    );
  });

  it('should delete filtered stores', async () => {
    const query = {};
    expect(await controller.deleteFilteredStores(query)).toEqual({});
    expect(mockStoreService.deleteFilteredStores).toHaveBeenCalledWith(query);
    expect(await controller.deleteFilteredStores()).toEqual({});
    expect(mockStoreService.deleteFilteredStores).toHaveBeenLastCalledWith(
      undefined,
    );
  });

  it('should delete store by id', async () => {
    const idParam = { id: 'abc' };
    expect(await controller.deleteStoreById(idParam)).toEqual({
      id: idParam.id,
    });
    expect(mockStoreService.deleteStoreById).toHaveBeenCalledWith(idParam.id);
  });

  it('should soft delete store by id', async () => {
    const idParam = { id: 'abc' };
    expect(await controller.softDeleteStoreById(idParam)).toEqual({
      id: idParam.id,
    });
    expect(mockStoreService.softDeleteStoreById).toHaveBeenCalledWith(
      idParam.id,
    );
  });

  it('should restore a soft deleted store', async () => {
    const idParam = { id: 'abc' };
    expect(await controller.restoreStoreById(idParam)).toEqual({
      id: idParam.id,
    });
    expect(mockStoreService.restoreStoreById).toHaveBeenCalledWith(idParam.id);
  });
});
