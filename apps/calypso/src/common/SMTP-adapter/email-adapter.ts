import * as nodemailer from 'nodemailer';
import { ApiConfigService } from '../helpers/api.config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
  constructor(private apiConfigService: ApiConfigService) {}

  async sendEmailConfirmationLink(email: string, code: string) {
    const transporter = this.createTransport();
    await transporter.sendMail({
      from: '"KustoGram" <kustogram@gmail.com>',
      to: email,
      subject: 'Confirmation link',
      text: 'Для подтверждения регистрации пройдите по ссылке',
      html: `<p>Привет, вот <a href="${this.apiConfigService.addressSiteForConfirmation}/auth/registration/check?code=${code}">ссылка</a> для подтверждения почты</p>`,
    });
  }

  async sendEmailPasswordRecoveryLink(email: string, code: string) {
    const transporter = this.createTransport();
    await transporter.sendMail({
      from: '"KustoGram" <kustogram@gmail.com>',
      to: email,
      subject: 'Password recovery link',
      text: 'Для изменения пароля пройдите по ссылке',
      html: `<p>Привет, вот <a href="${this.apiConfigService.addressSiteForConfirmation}/auth/new_password?code=${code}">ссылка</a> для обновления пароля</p>`,
    });
  }

  async sendEmailGoogleOrGithubRegistration(email: string) {
    const transporter = this.createTransport();
    await transporter.sendMail({
      from: '"KustoGram" <kustogram@gmail.com>',
      to: email,
      subject: 'Successful registration',
      text: 'Вы успешно зарегистрировались в KustoGram',
    });
  }

  // async sendEmailForMergeAccount(email: string, code: string) {
  //   const transporter = this.createTransport();
  //   await transporter.sendMail({
  //     from: '"KustoGram" <kustogram@gmail.com>',
  //     to: email,
  //     subject: 'Merge accounts',
  //     text: 'Для объединения аккаунтов пройдите по ссылке',
  //     html: `<p>Пользователь с таким ${email} уже зарегистрирован. Если это вы, то пройдите по <a href="${this.apiConfigService.addressSiteForConfirmation}?code=${code}">ссылке</a></p>`,
  //   });
  // }

  private createTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: this.apiConfigService.nodeMailerUser,
        pass: this.apiConfigService.nodeMailerPassword,
      },
    });
  }
}
