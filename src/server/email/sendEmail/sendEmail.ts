import transporter from "../transporter.js";
import debugConfig from "debug";
import chalk from "chalk";
import { environment } from "../../../loadEnvironments.js";
import type { EmailOptions } from "../../../types/types.js";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

const {
  smtp: { emailSender },
} = environment;

const debug = debugConfig("identity-server:email");

const sendEmail = async ({
  to,
  text,
  subject,
  ...rest
}: EmailOptions): Promise<SMTPTransport.SentMessageInfo | Error> =>
  new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: emailSender,
        to,
        subject,
        text,
        ...rest,
      },

      (err, info) => {
        if (err) {
          debug(chalk.red.bold(`Problem sending email: ${err.message}`));

          reject(err);
        }

        debug(chalk.green.bold(`Email sent successfully: ${info.response}`));
        resolve(info);
      }
    );
  });

export default sendEmail;
