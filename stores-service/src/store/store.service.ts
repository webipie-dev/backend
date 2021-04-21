import { Injectable } from '@nestjs/common';
import { Store } from './interfaces/store.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel('Store') private readonly storeModel: Model<Store>,
  ) {}

  async getAllStores(): Promise<Store[]> {
    return this.storeModel.find();
  }

  async getOneStore(id: string): Promise<Store> {
    return this.storeModel.findById(id);
  }
}
