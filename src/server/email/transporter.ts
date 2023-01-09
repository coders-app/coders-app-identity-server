import nodemailer from "nodemailer";
import { environment } from "../../loadEnvironments.js";

const { smtp } = environment;

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  auth: {
    user: smtp.username,
    pass: smtp.password,
  },
});

export default transporter;
