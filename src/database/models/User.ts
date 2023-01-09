import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    activationKey: {
      type: String,
      expires: 86400000,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema, "users");

export default User;
