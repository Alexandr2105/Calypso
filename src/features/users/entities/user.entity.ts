import { Prisma } from '@prisma/client';

export class UserEntity implements Prisma.UserCreateInput {
  id: string;

  login: string;

  email: string;

  createdAt: Date;

  passwordHash: string;

  isDeleted: boolean;

  constructor(
    id: string,
    login: string,
    email: string,
    createdAt: Date,
    passwordHash: string,
    isDeleted: boolean,
  ) {
    (this.id = id),
      (this.login = login),
      (this.email = email),
      (this.createdAt = createdAt),
      (this.passwordHash = passwordHash),
      (this.isDeleted = isDeleted);
  }
}
