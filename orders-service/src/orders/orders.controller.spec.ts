import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';

describe('Create an order', () => {
  it.todo("Throw bad request error if request body is incompatible");
});

describe('Fetch Order',() => {
  it.todo("Should throw 403 unauthorized error if store owner not authenticated");
})
