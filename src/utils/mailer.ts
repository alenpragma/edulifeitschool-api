import nodemailer from "nodemailer";
import config from "../config/env";

const transporter = nodemailer.createTransport(config.SMTP_URL);

export const sendEmail = ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) =>
  transporter.sendMail({
    from: decodeURIComponent(new URL(config.SMTP_URL).username),
    to,
    subject,
    text,
    html,
  });
