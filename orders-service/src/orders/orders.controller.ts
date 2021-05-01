import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { NewOrderDto } from "../models/dto/new-order.dto";
import { ProductDto } from "../models/dto/product.dto";
import { StoreDto } from "../models/dto/store.dto";
import { UpdateOrderDto } from "../models/dto/update-order.dto";

@Controller('api/orders')
export class OrdersController {

  constructor(private ordersService: OrdersService) {}

// Retrieve the store id from the sent token and retrieve the orders of its store
  @Get(':storeId')
  async getOrders(@Param('storeId') storeId: string) {
    return await this.ordersService.getOrders(storeId);
  }

  // Retrieve an order
  // Verify token role: if client : retrieve his order if its his
  // if store owner: verify if this order belongs to his store and send it back
  @Get('order/:id')
  async getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(id,'storeId goes in here from the token');
  }

  //Create a new order by a client
  @Post()
  async createOrder(@Body() newOrder: NewOrderDto) {
    return await this.ordersService.createOrder(newOrder);
  }

  @Post('/products')
  async createProduct(@Body() productDto: ProductDto){
    return await this.ordersService.saveProduct(productDto);
  }

  @Post('/stores')
  async createStore(@Body() storeDto: StoreDto){
    return await this.ordersService.saveStore(storeDto);
  }

  // Verify token role: if client: it can only cancel the order
  // if store owner: it can either confirm or cancel the order
  // if to cancel the order: change its status to cancelled
  @Put(':id')
  async updateOrder(@Param('id') id: string,
                    @Body() updatedOrder: UpdateOrderDto) {
    return this.ordersService.updateOrder(id, updatedOrder,'storeId goes in here from the token');
  }
}
