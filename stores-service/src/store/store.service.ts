import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Store } from './interfaces/store.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateStoreDto } from './dto/ceate-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { TemplateService } from '../template/template.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel('Store') private readonly storeModel: SoftDeleteModel<Store>,
    private templateService: TemplateService,
  ) {}

  async getFilteredStores(filters: Record<string, unknown>): Promise<Store[]> {
    return this.storeModel.find(filters);
  }

  async getOneStore(id: string): Promise<Store> {
    return this.storeModel.findById(id);
  }

  async getDeletedStores(): Promise<Store[]> {
    return this.storeModel.findDeleted();
  }

  async getStoreUrls(): Promise<{ url: string }[]> {
    return this.storeModel.find().select({ url: 1, _id: 0 });
  }

  async addOneStore(storeDTO: CreateStoreDto): Promise<Store> {
    const { template: templateId } = storeDTO;
    const template = await this.templateService.getOneTemplate(templateId);
    if (!template) {
      throw new HttpException('Template Not Found', HttpStatus.NOT_FOUND);
    }
    delete storeDTO.template;
    const storeToBe = {
      ...storeDTO,
      url:
        storeDTO.name.toLowerCase().replace(/\s/g, '').replace(/'/, '') +
        '.webipie.com',
      template,
    };
    let store: Store;
    try {
      store = await new this.storeModel(storeToBe);
      await store.save();
    } catch (e) {
      console.log(e);
      throw new HttpException(
        { message: e.message, field: e.keyPattern, value: e.keyValue },
        HttpStatus.BAD_REQUEST,
      );
    }
    return store;
  }

  async editOneStore(id: string, storeDTO: UpdateStoreDto): Promise<Store> {
    const store = await this.storeModel.findById(id).populate('template');
    if (!store) {
      throw new HttpException('Store Not Found', HttpStatus.NOT_FOUND);
    }
    return this.storeModel.findByIdAndUpdate(id, storeDTO, {
      new: true,
    });
  }

  async deleteAllStores(): Promise<Record<string, unknown>> {
    return this.storeModel.deleteMany();
  }

  async deleteStoreById(id: string): Promise<Store> {
    return this.storeModel.findByIdAndDelete(id);
  }

  async softDeleteStoreById(id: string): Promise<Store> {
    return this.storeModel.softDelete(id);
  }

  async restoreStoreById(id: string): Promise<Store> {
    return this.storeModel.restore(id);
  }
}
