import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type { EmailOptions } from "../email/types";

const emailOptionsFactory = Factory.define<EmailOptions>(() => ({
  to: faker.internet.email(),
  subject: faker.random.words(5),
  text: faker.random.words(50),
}));

export const getRandomEmailOptions = (params: Partial<EmailOptions>) =>
  emailOptionsFactory.build(params);
