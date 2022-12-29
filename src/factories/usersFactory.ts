import { Factory } from "fishery";
import type { UserStructure } from "../database/models/User";
import { faker } from "@faker-js/faker";
import type { RegisterUserBody } from "../server/schemas/registerUserSchema";

const userFactory = Factory.define<UserStructure>(() => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(10),
  isActive: false,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
}));

const userCredentialsFactory = Factory.define<Partial<RegisterUserBody>>(
  () => ({
    name: faker.internet.userName(),
    password: faker.internet.password(10),
    email: faker.internet.email(),
  })
);

export const getMockUser = (params?: Partial<UserStructure>) =>
  userFactory.build(params);

export const getMockUserCredentials = (params?: Partial<RegisterUserBody>) =>
  userCredentialsFactory.build(params);
