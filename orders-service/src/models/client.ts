import * as mongoose from "mongoose";
import { Model } from "mongoose";

interface ClientAttrs {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface ClientDoc extends mongoose.Document{
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface ClientModel extends Model<ClientDoc>{
  build(attrs: ClientAttrs): ClientDoc;
}

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

clientSchema.statics.build = (attrs: ClientAttrs) => {
  return new Client(attrs);
}

const Client = mongoose.model<ClientDoc,ClientModel>('Client', clientSchema);

export { ClientModel, clientSchema as ClientSchema }
