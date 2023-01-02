import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { UserStructure } from "../types/types";

const userFactory = Factory.define<UserStructure>(() => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(10),
  isActive: false,
  isAdmin: false,
}));

export const getMockUser = (params?: Partial<UserStructure>) =>
  userFactory.build(params);
