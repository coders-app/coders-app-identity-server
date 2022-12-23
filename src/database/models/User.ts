import { model, Schema } from "mongoose";

const userSchema = new Schema({
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
  },
  isActive: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const User = model("User", userSchema, "users");

export default User;
