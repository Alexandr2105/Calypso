import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { createTransport } from 'nodemailer';
import { createApp } from '../src/common/helpers/createApp';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('Create test for auth', () => {
  jest.setTimeout(5 * 60 * 1000);
  let app: INestApplication;
  let test;
  let sendMailMock;
  let code;
  const user = {
    login: 'Alex11',
    password: 'QWERTY',
    email: '5030553@gmail.com',
  };

  beforeAll(async () => {
    sendMailMock = jest.fn();
    (createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app = createApp(app);
    await app.init();
    test = request(app.getHttpServer());
    return test.del('/delete-all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Регистрируем нового пользователя', async () => {
    await test.post('/auth/registration').send(user).expect(204);
    const { html } = sendMailMock.mock.lastCall[0];
    const regex = /code=([a-zA-Z0-9-]+)/;
    code = html.match(regex)[1];
    const info1 = await test
      .post('/auth/registration')
      .send({ login: '', password: '', email: '' })
      .expect(400);
    expect(info1.body).toEqual({
      errorsMessages: [
        { message: 'Wrong length', field: 'login' },
        { message: 'Invalid email', field: 'email' },
        { message: 'Wrong length', field: 'password' },
      ],
    });
    expect(sendMailMock).toHaveBeenCalled();
  });

  it('Подтверждаем регистрацию по коду', async () => {
    await test.get(`/auth/email-confirmation/${code}`).expect(204);
    await test.get('/auth/email-confirmation/:code').expect(400);
  });

  it('login и получения токена', async () => {
    const token = await test
      .post('/auth/login')
      .send({
        loginOrEmail: user.login,
        password: user.password,
      })
      .set('user-agent', 'Chrome')
      .expect(200);
    await test
      .post('/auth/login')
      .send({
        loginOrEmail: 'user.login',
        password: 'user.password',
      })
      .set('user-agent', 'Chrome')
      .expect(401);
    const info = await test
      .get('/auth/me')
      .auth(token.body.accessToken, { type: 'bearer' })
      .set('user-agent', 'Chrome')
      .expect(200);
    expect(info.body).toEqual({
      email: user.email,
      login: user.login,
      id: expect.any(String),
    });
    await test
      .get('/auth/me')
      .auth('token.body.accessToken', { type: 'bearer' })
      .set('user-agent', 'Chrome')
      .expect(401);
  });

  it('Запрашиваем новый код по email', async () => {
    await test
      .post('/auth/refresh-link')
      .send({ email: user.email })
      .expect(204);
    const info = await test
      .post('/auth/refresh-link')
      .send({ email: '1234!gmail.com' })
      .expect(400);
    expect(info.body).toEqual({
      errorsMessages: [{ message: 'Invalid email', field: 'email' }],
    });
  });

  it('Делаем запрос на смену пароля', async () => {
    await test
      .post('/auth/password-recovery')
      .send({ email: user.email })
      .expect(204);
    const { html } = sendMailMock.mock.lastCall[0];
    const regex = /code=([a-zA-Z0-9-]+)/;
    code = html.match(regex)[1];
    await test
      .post('/auth/password-recovery')
      .send({ email: 'a!gmail.co' })
      .expect(400);
  });

  it('Устанавливаем новый пароль входим и выходим', async () => {
    await test
      .post('/auth/new-password')
      .send({
        newPassword: 'string',
        recoveryCode: code,
      })
      .expect(204);
    const info = await test
      .post('/auth/new-password')
      .send({
        newPassword: '',
        recoveryCode: '123',
      })
      .expect(400);
    expect(info.body).toEqual({
      errorsMessages: [
        { message: 'Wrong length', field: 'newPassword' },
        { message: 'Incorrect confirmation code', field: 'recoveryCode' },
      ],
    });
    const response = await test
      .post('/auth/login')
      .send({ loginOrEmail: 'Alex11', password: 'string' })
      .set('user-agent', 'Chrome')
      .expect(200);
    await test
      .post('/auth/login')
      .send({ loginOrEmail: 'Alex11', password: 'string1' })
      .set('user-agent', 'Chrome')
      .expect(401);
    const refreshToken = response.headers['set-cookie'];
    await test.post('/auth/logout').set('Cookie', 'asdfadf').expect(401);
    const info2 = await test
      .get('/auth/me')
      .auth(response.body.accessToken, { type: 'bearer' })
      .set('user-agent', 'Chrome')
      .expect(200);
    expect(info2.body).toEqual({
      email: user.email,
      login: user.login,
      id: expect.any(String),
    });
    await test.post('/auth/logout').set('Cookie', refreshToken).expect(204);
  });
});
