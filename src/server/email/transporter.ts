import nodemailer from "nodemailer";
import { environment } from "../../loadEnvironments";

const { smtp, sendgridApiKey } = environment;

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  auth: {
    user: smtp.username,
    pass: sendgridApiKey,
  },
});

export default transporter;
