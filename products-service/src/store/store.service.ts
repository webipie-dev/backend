import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Store } from '../interfaces/store.interface';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel('Store')
    private readonly storeModel: SoftDeleteModel<Store>,
  ) {}

  async getAllProducts() {
    return this.storeModel.find();
  }

  async getOneStore(id: string) {
    return this.storeModel.findById(id);
  }

  async addOneStore() {
    const store = new this.storeModel({
      name: 'one store',
    });
    return await store.save();
  }
}
