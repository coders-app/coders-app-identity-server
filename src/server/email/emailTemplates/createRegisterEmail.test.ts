import { luisName } from "../../../testUtils/mocks/mockUsers";
import createRegisterEmail from "./createRegisterEmail";

describe("Given the function createRegisterEmail", () => {
  describe("When it receives name 'Luis' and activation key 'test-activation-key'", () => {
    test(`Then it should return and subject: 'Welcome to Coders App, Luis. Please activate your account' and text:
    Hello Luis,

    Welcome to Coders App.

    You need to set a password to activate your account.

    Here's your activation key: test-activation-key

    Your activation key expires in 24 hours.`, () => {
      const activationKey = "test-activation-key";
      const expectedEmailText = `Hello Luis,\n\nWelcome to Coders App.\n\nYou need to set a password to activate your account.\n\nHere's your activation key: test-activation-key\n\nYour activation key expires in 24 hours.`;
      const expectedEmailSubject =
        "Welcome to Coders App, Luis. Please activate your account";
      const expectedEmail = {
        text: expectedEmailText,
        subject: expectedEmailSubject,
      };

      const registerEmail = createRegisterEmail(luisName, activationKey);

      expect(registerEmail).toStrictEqual(expectedEmail);
    });
  });
});
