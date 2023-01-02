import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { UserData, UserStructure } from "../types/types";

const userFactory = Factory.define<UserStructure>(() => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(10),
  isActive: false,
  isAdmin: faker.datatype.boolean(),
}));

const userCredentialsFactory = Factory.define<Partial<UserData>>(() => ({
  name: faker.internet.userName(),
  password: faker.internet.password(10),
  email: faker.internet.email(),
}));

export const getMockUser = (params?: Partial<UserStructure>) =>
  userFactory.build(params);

export const getMockUserCredentials = (params?: Partial<UserData>) =>
  userCredentialsFactory.build(params);
