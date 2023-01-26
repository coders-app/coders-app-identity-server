import transporter from "../transporter.js";
import debugConfig from "debug";
import chalk from "chalk";
import { environment } from "../../loadEnvironments.js";
import type { EmailOptions } from "../types/types.js";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

const {
  smtp: { emailSender },
} = environment;

const debug = debugConfig("identity-server:email");

const sendEmail = async ({
  to,
  text,
  subject,
  ...emailOptions
}: EmailOptions): Promise<SMTPTransport.SentMessageInfo | Error> =>
  new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: emailSender,
        to,
        subject,
        text,
        ...emailOptions,
      },

      (error, information) => {
        if (error) {
          debug(chalk.red.bold(`Problem sending email: ${error.message}`));

          reject(error);
        }

        debug(
          chalk.green.bold(`Email sent successfully: ${information.response}`)
        );
        resolve(information);
      }
    );
  });

export default sendEmail;
