import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";

jest.setTimeout(30000);

let mongo: MongoMemoryServer;

export const rootMongooseTestModule = () =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongo = new MongoMemoryServer();
      const mongoUri = await mongo.getUri();
      return {
        uri: mongoUri,
        useNewUrlParser: true,
        useUnifiedTopology: true
      };
    }
  });

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// afterAll(async () => {
//   if(mongo) await mongo.stop();
//   await mongoose.disconnect();
//   await mongoose.connection.close();
// });


