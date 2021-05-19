import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Store } from './interfaces/store.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { TemplateService } from '../template/template.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel('Store') private readonly storeModel: SoftDeleteModel<Store>,
    private templateService: TemplateService,
  ) {}

  async getFilteredStores(filters?: Record<string, unknown>): Promise<Store[]> {
    return await this.storeModel.find(filters).catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  async getOneStore(id: string): Promise<Store> {
    return await this.storeModel.findById(id).catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  async getDeletedStores(): Promise<Store[]> {
    let deletedStores: Store[];
    try {
      deletedStores = await this.storeModel.findDeleted();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return deletedStores;
  }

  async getStoreUrls(): Promise<{ url: string }[]> {
    return await this.storeModel
      .find()
      .select({ url: 1, _id: 0 })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  async addOneStore(storeDTO: CreateStoreDto): Promise<Store> {
    const { template: templateId } = storeDTO;
    const template = await this.templateService.getOneTemplate(templateId);
    if (!template) {
      throw new NotFoundException('Template Not Found');
    }
    delete storeDTO.template;
    const storeToBe = {
      ...storeDTO,
      url:
        storeDTO.name.toLowerCase().replace(/\s/g, '').replace(/'/, '') +
        '.webipie.com',
      template,
    };
    const store = await new this.storeModel(storeToBe);
    return await store.save().catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  async editOneStore(id: string, storeDTO: UpdateStoreDto): Promise<Store> {
    const store = await this.storeModel.findById(id).populate('template');
    if (!store) {
      throw new NotFoundException('Store Not Found');
    }
    return await this.storeModel
      .findByIdAndUpdate(id, storeDTO, {
        new: true,
      })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  async deleteFilteredStores(
    filters?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return await this.storeModel.deleteMany(filters).catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  async deleteStoreById(id: string): Promise<Store> {
    return await this.storeModel.findByIdAndDelete(id).catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  async softDeleteStoreById(id: string): Promise<Store> {
    let deletedStore: Store;
    try {
      deletedStore = await this.storeModel.softDelete(id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return deletedStore;
  }

  async restoreStoreById(id: string): Promise<Store> {
    let restoredStore: Store;
    try {
      restoredStore = await this.storeModel.restore(id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return restoredStore;
  }
}
