import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type { UserCredentials } from "../types/types";

const userCredentialsFactory = Factory.define<UserCredentials>(() => ({
  email: faker.internet.email(),
  password: faker.internet.password(10),
}));

export const getMockUserCredentials = (params?: Partial<UserCredentials>) =>
  userCredentialsFactory.build(params);
