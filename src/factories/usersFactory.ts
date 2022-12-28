import { Factory } from "fishery";
import type { UserStructure } from "../database/models/User";
import { faker } from "@faker-js/faker";

const userFactory = Factory.define<UserStructure>(() => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(10),
  isActive: false,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
}));

export const getMockUser = () => userFactory.build();
