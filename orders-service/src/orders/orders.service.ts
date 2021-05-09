import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OrderDoc } from "../models/order";
import { NewOrderDto } from "../models/dto/new-order.dto";
import { ClientDoc } from "../models/client";
import { StoreDoc } from "../models/store";
import { ProductDoc } from "../models/product";
import { OrderStatus } from "../models/order-status.enum";
import { PaymentMethods } from "../models/payment-methods.enum";
import { ProductDto } from "../models/dto/product.dto";
import { StoreDto } from "../models/dto/store.dto";
import { Model } from "mongoose";
import { UpdateOrderDto } from "../models/dto/update-order.dto";

@Injectable()
export class OrdersService {

  constructor(@InjectModel('Order') private order: Model<OrderDoc>,
              @InjectModel('Client') private client: Model<ClientDoc>,
              @InjectModel('Product') private product: Model<ProductDoc>,
              @InjectModel('Store') private store: Model<StoreDoc>) {
  }

  //add pagination to this
  //Only accessed by store owner
  async getOrders (storeId: string) {
    const store = await this.store.findById(storeId);
    if (!store)
      throw new NotFoundException(`Store ${storeId} not found`);
    return this.order.find({storeId}).populate('client');
  }

  //Only accessed by store owner
  async getOrder(orderId: string, storeId: string) {
    const store = await this.store.findById(storeId);
    if (!store)
      throw new NotFoundException(`Store ${storeId} not found`);
    const order = await this.order.findById(orderId).populate('client products.product');
    if (order.storeId !== store.id)
      throw new NotFoundException(`Order ${orderId} not found in current store`);
    if(!order)
      throw new NotFoundException(`Order ${orderId} not found in current store`);
    return order;
  }

  async createOrder(newOrder: NewOrderDto) {
    const store = await this.store.findById(newOrder.storeId);
    if (!store)
      throw new NotFoundException(`Store ${newOrder.storeId} Not Found`);

    const products = [];
    let product;
    let totalPrice = 0;

    const session = await this.product.startSession();
    session.startTransaction();
      for (const orderedProduct of newOrder.products){
        product = await this.product.findById(orderedProduct.id);
        if (!product)
          throw new NotFoundException(`Product with id ${orderedProduct.id} Not Found`);
        if(product.storeId !== store.id)
          throw new BadRequestException("Product available within another store");
        if (product.stock < orderedProduct.orderedQuantity)
          throw new BadRequestException("Ordered quantity is more than the available stock");
        product.set({ stock: product.stock - orderedProduct.orderedQuantity});
        await product.save();
        products.push({ product: product, orderedQuantity: orderedProduct.orderedQuantity });
        totalPrice += product.price * orderedProduct.orderedQuantity;
      }

      let client = await this.client.findOne({ phoneNumber: newOrder.client.phoneNumber });
      if(!client){
        client = new this.client(newOrder.client);
        await client.save();
      }

      const order = new this.order({
        orderDate: new Date(),
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethods[newOrder.paymentMethod],
        products,
        storeId: newOrder.storeId,
        client,
        totalPrice
      });
      await order.save();
      //publish order:created event to inform products service with the new stock
      await session.commitTransaction();
      return order;
      session.endSession();
  }

  //by store owner only
  async updateOrder(orderId: string, updateOrder: UpdateOrderDto, storeId: string) {
    const order = await this.order.findOne({ _id: orderId , status: { // fetch by id than test on status not cancelled
      $ne: OrderStatus.CANCELLED
      }, storeId: storeId});
    if (!order)
      throw new NotFoundException('Order Not Found in Current Store');
    if (updateOrder.status === OrderStatus.CONFIRMED && order.status === OrderStatus.PENDING){
      order.set({ status: OrderStatus.CONFIRMED });
      await order.save();
      return order;
    } else if (updateOrder.status === OrderStatus.CANCELLED  && order.status === OrderStatus.PENDING){
      order.set({ status: OrderStatus.CANCELLED });
      await order.save();
      return order;
    } else if (updateOrder.status === OrderStatus.PENDING && order.status === OrderStatus.CONFIRMED)
        throw new BadRequestException('Can\'t update order status from CONFIRMED to PENDING');
    else if (updateOrder.status === OrderStatus.CANCELLED && order.status === OrderStatus.CONFIRMED)
      throw new BadRequestException('Can\'t update order status from CONFIRMED to CANCELLED');
  }

  async saveProduct (productDto: ProductDto){
    const product = new this.product({
      _id: productDto.id,
      ...productDto
    });
    await product.save();
    return product;
  }

  async saveStore (storeDto: StoreDto) {
    const store = new this.store({ _id: storeDto.id });
    await store.save();
    return store
  }
}
