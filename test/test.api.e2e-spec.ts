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
    expect(token.body).toEqual({
      accessToken: expect.any(String),
      profile: false,
    });
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

  it('Получаем новую пару accessToken и refreshToken', async () => {
    const response = await test
      .post('/auth/login')
      .send({ loginOrEmail: 'Alex11', password: 'string' })
      .set('user-agent', 'Chrome')
      .expect(200);
    const refreshToken = response.headers['set-cookie'];
    const response2 = await test
      .post('/auth/refresh-token')
      .set('Cookie', refreshToken)
      .expect(200);
    const refreshToken2 = response2.headers['set-cookie'];
    expect(response2.body.accessToken).not.toEqual(response.body.accessToken);
    expect(refreshToken).not.toEqual(refreshToken2);
  });
});

describe('Create test for profiles', () => {
  jest.setTimeout(5 * 60 * 1000);
  let app: INestApplication;
  let test;
  let sendMailMock;
  let code;
  let token;
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
    token = await test
      .post('/auth/login')
      .send({
        loginOrEmail: user.login,
        password: user.password,
      })
      .set('user-agent', 'Chrome')
      .expect(200);
    expect(token.body).toEqual({
      accessToken: expect.any(String),
      profile: false,
    });
  });

  it('Создаем профайл и проверяем его на обновление', async () => {
    await test
      .post('/users/profiles/save-profileInfo')
      .auth(token.body.accessToken, { type: 'bearer' })
      .send({
        login: 'string',
        firstName: 'string',
        lastName: 'string',
        dateOfBirthday: '21-05-1988',
        city: 'string',
        userInfo: 'string',
      })
      .expect(204);
    await test.get('/users/profiles/profile').expect(401);
    await test.post('/users/profiles/save-profileInfo').expect(401);
    const profile = await test
      .get('/users/profiles/profile')
      .auth(token.body.accessToken, { type: 'bearer' })
      .expect(200);
    expect(profile.body).toEqual({
      userId: expect.any(String),
      login: 'string',
      firstName: 'string',
      lastName: 'string',
      dateOfBirthday: '21-05-1988',
      city: 'string',
      userInfo: 'string',
      photo: null,
    });
    await test
      .post('/users/profiles/save-profileInfo')
      .auth(token.body.accessToken, { type: 'bearer' })
      .send({
        login: 'string1',
        firstName: 'string',
        lastName: '',
        dateOfBirthday: '21-05-1988',
        city: 'string',
        userInfo: '',
      })
      .expect(204);
    const profile2 = await test
      .get('/users/profiles/profile')
      .auth(token.body.accessToken, { type: 'bearer' })
      .expect(200);
    expect(profile2.body).toEqual({
      userId: expect.any(String),
      login: 'string1',
      firstName: 'string',
      lastName: '',
      dateOfBirthday: '21-05-1988',
      city: 'string',
      userInfo: '',
      photo: null,
    });
    const profile3 = await test
      .post('/users/profiles/save-profileInfo')
      .auth(token.body.accessToken, { type: 'bearer' })
      .send({
        login: 'str',
        firstName: 'stringasdfdsafsdafsdfsdfsdfdfsdfdsfasfdafsdfadfadfafadsfa',
        lastName: 'stringasdfdsafsdafsdfsdfsdfdfsdfdsfasfdafsdfadfadfafadsfa',
        dateOfBirthday: '21.05.88',
        city: 'stringasdfdsafsdafsdfsdfsdfdfsdfdsfasfdafsdfadfadfafadsfa',
        userInfo:
          'stringasdfdsafsdafsdfsdfsdfdfsdfdsfasfdafsdfadfadfafadsfastringasdfdsa' +
          'fsdafsdfsdfsdfdfsdfdsfasfdafsdfadfadfafadsfastringasdfdsafsdafsdfsdfsdfdfs' +
          'dfdsfasfdafsdfadfadfafadsfastringasdfdsafsdafsdfsdfsdfdfsdfdsfasfdafsdfadf' +
          'dfafadsfastringasdfdsafsdafsdfsdfsdfdfsdfdsfasfdafsdfadfadfafadsfass',
      })
      .expect(400);
    expect(profile3.body).toEqual({
      errorsMessages: [
        { message: 'Wrong length', field: 'login' },
        { message: 'Wrong length', field: 'firstName' },
        { message: 'Wrong length', field: 'lastName' },
        {
          message: 'Invalid date format. Please use the format dd-mm-yyyy.',
          field: 'dateOfBirthday',
        },
        { message: 'Wrong length', field: 'city' },
        { message: 'Wrong length', field: 'userInfo' },
      ],
    });
  });

  it('Проверка на возвращение токена и profile = true,', async () => {
    const refreshToken = token.headers['set-cookie'];
    await test.post('/auth/logout').set('Cookie', refreshToken).expect(204);
    token = await test
      .post('/auth/login')
      .send({
        loginOrEmail: user.login,
        password: user.password,
      })
      .set('user-agent', 'Chrome')
      .expect(200);
    expect(token.body).toEqual({
      accessToken: expect.any(String),
      profile: true,
    });
  });

  it('Проверяем сохранение аватара и его получение', async () => {
    await test.post('/users/profiles/save-avatar').expect(401);
    await test
      .post('/users/profiles/save-avatar')
      .auth(token.body.accessToken, { type: 'bearer' })
      .attach('avatar', 'D:/blogWalpaper.jpg')
      .expect(204);
    const profile = await test
      .get('/users/profiles/profile')
      .auth(token.body.accessToken, { type: 'bearer' })
      .expect(200);
    expect(profile.body).toEqual({
      userId: expect.any(String),
      login: 'Alex11',
      firstName: 'string',
      lastName: '',
      dateOfBirthday: '21-05-1988',
      city: 'string',
      userInfo: '',
      photo: `https://storage.yandexcloud.net/my1bucket/${profile.body.userId}/avatars/${profile.body.userId}_avatar.png`,
    });
  });
});
