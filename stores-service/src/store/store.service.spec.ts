import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../mongoose-mock';
import { StoreSchema } from './schemas/store.schema';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Store } from './interfaces/store.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import * as mongoose from 'mongoose';
import { TemplateSchema } from '../template/schemas/template.schema';
import { Template } from '../template/interfaces/template.interface';
import { TemplateService } from '../template/template.service';

describe('StoreService', () => {
  let service: StoreService;
  let templateServide: TemplateService;
  let module: TestingModule;
  let storeModel: SoftDeleteModel<Store>;
  let templateModel: SoftDeleteModel<Template>;

  const createTemplateDto = {
    name: 'test template',
    font: 'montserrat',
    fontOptions: ['montserrat'],
    colorChart: { testColor: 'test' },
    colorChartOptions: [{ testColor: 'test' }],
    header: {
      img: 'image',
      description: 'description',
      mainButton: 'button',
      title: 'title',
    },
  };
  const createStoreDto = {
    name: 'test store',
    type: 'clothes',
    template: mongoose.Types.ObjectId().toHexString(),
  };

  const templateId = async () => {
    const template = await templateServide.addOneTemplate(createTemplateDto);
    return template.id;
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Store', schema: StoreSchema },
          { name: 'Template', schema: TemplateSchema },
        ]),
      ],
      providers: [StoreService, TemplateService],
    }).compile();

    service = module.get<StoreService>(StoreService);
    templateServide = module.get<TemplateService>(TemplateService);
    storeModel = module.get<SoftDeleteModel<Store>>('StoreModel');
    templateModel = module.get<SoftDeleteModel<Template>>('TemplateModel');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(templateServide).toBeDefined();
  });

  it('should throw an error when inserting an erroneous template id', async () => {
    try {
      await service.addOneStore(createStoreDto);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toEqual('Template Not Found');
    }
  });

  it('should throw when inserting a duplicate store name', async () => {
    const id = await templateId();
    createStoreDto.template = id;
    await service.addOneStore(createStoreDto);
    try {
      createStoreDto.template = id;
      await service.addOneStore(createStoreDto);
    } catch (e) {
      expect(e).toBeInstanceOf(InternalServerErrorException);
      expect(e.message).toEqual(
        'E11000 duplicate key error dup key: { : "test store" }',
      );
    }
  });

  it('should create a store', async () => {
    const id = await templateId();
    createStoreDto.template = id;
    const store = await service.addOneStore(createStoreDto);
    expect(store.template.id).toEqual(id);
    expect(store.isDeleted).toEqual(false);
    expect(store.deletedAt).toEqual(null);
  });

  it('should fetch only available stores', async () => {
    const id = await templateId();
    createStoreDto.template = await id;
    const store = await service.addOneStore(createStoreDto);
    const createStoreDto2 = {
      name: 'test store 2',
      type: 'clothes',
      template: id,
    };
    await service.addOneStore(createStoreDto2);
    await service.softDeleteStoreById(store.id);
    const availableStores = await service.getFilteredStores();
    expect(availableStores).toBeDefined();
    expect(availableStores).toHaveLength(1);
  });

  it('should fetch storeUrls', async () => {
    createStoreDto.template = await templateId();
    const store = await service.addOneStore(createStoreDto);
    expect(await service.getStoreUrls()).toHaveLength(1);
    expect((await service.getStoreUrls())[0].url).toEqual(store.url);
  });

  it("should fetch store by url, null if it doesn't exist", async () => {
    createStoreDto.template = await templateId();
    const store = await service.addOneStore(createStoreDto);
    expect((await service.getFilteredStores({ url: store.url }))[0].id).toEqual(
      store.id,
    );
    expect((await service.getFilteredStores({ url: 'random url' }))[0]).toEqual(
      undefined,
    );
  });

  it('should fetch a store if exists, null if not', async () => {
    createStoreDto.template = await templateId();
    const returnedStore = await service.addOneStore(createStoreDto);
    expect(await service.getOneStore(returnedStore.id)).toBeDefined();
    const id = new mongoose.Types.ObjectId().toHexString();
    expect(await service.getOneStore(id)).toBeNull();
  });

  it('should fetch all soft deleted stores', async () => {
    createStoreDto.template = await templateId();
    const store = await service.addOneStore(createStoreDto);
    await service.softDeleteStoreById(store.id);
    const deletedStores = await service.getDeletedStores();
    expect(deletedStores).toBeDefined();
    expect(deletedStores).toHaveLength(1);
  });

  it('should update a store', async () => {
    createStoreDto.template = await templateId();
    const storeReturned = await service.addOneStore(createStoreDto);
    const updatedStore = await service.editOneStore(storeReturned.id, {
      name: 'new name',
    });
    expect(updatedStore.name).toEqual('new name');
  });

  it('should throw an error when updating new store with erroneous dto, duplicate name', async () => {
    const id = await templateId();
    createStoreDto.template = id;
    const returnedStore = await service.addOneStore(createStoreDto);
    await service.addOneStore({
      template: id,
      name: 'second store',
      type: 'clothes',
    });
    try {
      await service.editOneStore(returnedStore.id, { name: 'second store' });
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toEqual(
        'E11000 duplicate key error dup key: { : "second store" }',
      );
    }
  });

  it("should delete a store by id and return null if store doesn't exist", async () => {
    createStoreDto.template = await templateId();
    const store = await service.addOneStore(createStoreDto);
    expect((await service.deleteStoreById(store.id)).id).toEqual(store.id);
    const id = new mongoose.Types.ObjectId().toHexString();
    expect(await service.deleteStoreById(id)).toBeNull();
  });

  it('should soft delete a store by id', async () => {
    createStoreDto.template = await templateId();
    const store = await service.addOneStore(createStoreDto);
    const softDeletedStore = await service.softDeleteStoreById(store.id);
    expect(softDeletedStore.isDeleted).toEqual(true);
    expect(softDeletedStore.deletedAt).not.toEqual(null);
  });

  it('should throw an error when soft deleting a non existing store', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    try {
      await service.softDeleteStoreById(id);
    } catch (error) {
      console.log(error.message);
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toEqual("Cannot read property 'isDeleted' of null");
    }
  });

  it('should restore a soft deleted store', async () => {
    createStoreDto.template = await templateId();
    const store = await service.addOneStore(createStoreDto);
    await service.softDeleteStoreById(store.id);
    const restoredStore = await service.restoreStoreById(store.id);
    expect(restoredStore.id).toEqual(store.id);
    expect(restoredStore.isDeleted).toEqual(false);
    expect(restoredStore.deletedAt).toBeNull();
  });

  it('should throw an error when restoring a non existing store', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    try {
      await service.restoreStoreById(id);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toEqual("Cannot read property 'isDeleted' of null");
    }
  });

  afterEach(async () => {
    await storeModel.deleteMany({});
    await templateModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
