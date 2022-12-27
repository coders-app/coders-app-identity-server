import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema, "users");

export default User;