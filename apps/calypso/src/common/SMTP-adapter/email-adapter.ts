import * as nodemailer from 'nodemailer';
import { settings } from '../../settings';

export class EmailAdapter {
  async sendEmailConfirmationLink(email: string, code: string) {
    const transporter = this.createTransport();
    await transporter.sendMail({
      from: '"KustoGram" <kustogram@gmail.com>',
      to: email,
      subject: 'Confirmation link',
      text: 'Для подтверждения регистрации пройдите по ссылке',
      html: `<p>Привет, вот <a href="${settings.ADDRESS_SITE_FOR_CONFIRMATION}/auth/registration/check?code=${code}">ссылка</a> для подтверждения почты</p>`,
    });
  }

  async sendEmailPasswordRecoveryLink(email: string, code: string) {
    const transporter = this.createTransport();
    await transporter.sendMail({
      from: '"KustoGram" <kustogram@gmail.com>',
      to: email,
      subject: 'Password recovery link',
      text: 'Для изменения пароля пройдите по ссылке',
      html: `<p>Привет, вот <a href="${settings.RECOVERY_PASSWORD}/auth/new_password?code=${code}">ссылка</a> для обновления пароля</p>`,
    });
  }

  async sendEmailGoogleRegistration(email: string) {
    const transporter = this.createTransport();
    await transporter.sendMail({
      from: '"KustoGram" <kustogram@gmail.com>',
      to: email,
      subject: 'Successful registration',
      text: 'Вы успешно зарегистрировались в KustoGram',
    });
  }

  private createTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  }
}
