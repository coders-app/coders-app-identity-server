import { Factory } from "fishery";
import type { UserStructure } from "../database/models/User";
import { faker } from "@faker-js/faker";

const userFactory = Factory.define<UserStructure>(({ params }) => ({
  name: faker.internet.userName() || params.name,
  email: faker.internet.email() || params.email,
  password: faker.internet.password(10) || params.password,
  isActive: false,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
}));

export const getMockUser = (params?: Partial<UserStructure>) =>
  userFactory.build(params);
