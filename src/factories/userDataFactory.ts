import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type { UserData } from "../types/types";

const userDataFactory = Factory.define<UserData>(() => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
}));

export const getMockUserData = (params?: Partial<UserData>) =>
  userDataFactory.build(params);
