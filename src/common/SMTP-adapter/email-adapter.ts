import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

export class EmailAdapter {
  async sendEmailRecoveryCode(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: '"INSTAGRAM" <instagram@gmail.com>',
      to: email,
      subject: 'Confirmation link',
      text: 'Для подтверждения регистрации пройдите по ссылке',
      html: `<p>Привет, вот <a href="${process.env.ADDRESS_SITE_FOR_CONFIRMATION}/auth/email-confirmation/${code}">ссылка для подтверждения почты</a></p>`,
    });
  }
}
