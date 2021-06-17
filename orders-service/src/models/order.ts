import * as mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "./order-status.enum";
import { ClientDoc } from "./client";
import { ProductDoc } from "./product";
import { PaymentMethods } from "./payment-methods.enum";

interface OrderAttrs {
  orderDate: Date;
  status: OrderStatus;
  paymentMethod: PaymentMethods;
  totalPrice: number;
  products: [ProductDoc];
  storeId: string;
  client: ClientDoc;
}

interface OrderDoc extends mongoose.Document{
  orderDate: Date;
  status: OrderStatus;
  paymentMethod: PaymentMethods;
  totalPrice: number;
  products: [ProductDoc];
  storeId: string;
  client: ClientDoc;
  version: number;
}

const orderSchema = new mongoose.Schema({
  orderDate: {
    type: mongoose.Schema.Types.Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: Object.values(PaymentMethods)
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  products: [
    {
      _id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      orderedQuantity: {
        type: Number,
        required: true
      }
    }
  ],
  storeId: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  }
});
orderSchema.set('versionKey','version');
orderSchema.plugin(updateIfCurrentPlugin);

export { OrderDoc, orderSchema as OrderSchema, OrderAttrs }
