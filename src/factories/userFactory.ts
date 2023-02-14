import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import type { UserWithId } from "../server/types";

const userFactory = Factory.define<UserWithId>(() => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(10),
  isActive: false,
  isAdmin: false,
  _id: new mongoose.Types.ObjectId().toString(),
  activationKey: faker.random.alphaNumeric(20),
}));

export const getMockUser = (params?: Partial<UserWithId>) =>
  userFactory.build(params);
