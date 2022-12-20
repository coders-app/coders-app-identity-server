import mongoose from "mongoose";

const connectDatabase = async (mongoUrl: string) => {
  await mongoose.connect(mongoUrl, { dbName: "coders-app-sso" });

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
