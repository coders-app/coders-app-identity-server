import { getRandomEmailOptions } from "../../factories/emailOptionsFactory.js";
import sendEmail from "./sendEmail.js";
import transporter from "../transporter.js";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import smtpStatusCodes from "../../utils/smtpStatusCodes.js";
import type { EmailOptions } from "../../types/types.js";
import { environment } from "../../loadEnvironments.js";

const {
  smtp: { emailSender },
} = environment;

const {
  positiveCompletion: { okCode },
} = smtpStatusCodes;

const mockMessageInformation: Partial<SMTPTransport.SentMessageInfo> = {
  response: `${okCode} Ok`,
};

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockImplementationOnce(() => ({
    sendMail(
      emailOptions: EmailOptions,
      callback: (err: Error, info: SMTPTransport.SentMessageInfo) => void
    ) {
      callback(null, mockMessageInformation as SMTPTransport.SentMessageInfo);
    },
  })),
}));

const sendMailSpy = jest.spyOn(transporter, "sendMail");

afterEach(() => jest.clearAllMocks());

describe("Given the function sendEmail", () => {
  const emailTo = "admin@isdicoders.com";
  const emailOptions = getRandomEmailOptions({ to: emailTo });

  describe("When it is invoked with to 'admin@isdicoders.com' and the email is sent successfully", () => {
    test("Then it should invoke transporter.sendMail and resolve with the message information", async () => {
      const messageInformation = await sendEmail(emailOptions);

      expect(sendMailSpy).toHaveBeenCalledWith(
        {
          ...emailOptions,
          from: emailSender,
        },
        expect.anything()
      );
      expect(
        (messageInformation as SMTPTransport.SentMessageInfo).response
      ).toBe(mockMessageInformation.response);
    });
  });
});
