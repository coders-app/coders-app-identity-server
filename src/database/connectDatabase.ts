import mongoose from "mongoose";
import { environment } from "../loadEnvironments.js";

const connectDatabase = async (mongoDbUrl: string) => {
  await mongoose.connect(mongoDbUrl);

  mongoose.set("debug", environment.mongoDbDebug);
  mongoose.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
      delete ret._id;
      delete ret.__v;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return ret;
    },
  });
};

export default connectDatabase;
