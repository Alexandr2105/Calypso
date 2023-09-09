import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';

export class UserEntity {
  @ApiProperty({ type: 'string', description: 'User id' })
  id: string;
  @ApiProperty({ type: 'string', description: 'User login' })
  login: string;
  @ApiProperty({ type: 'string', description: 'User email' })
  email: string;

  createdAt: Date;

  passwordHash?: string;

  isDeleted: boolean;

  googleAuthId?: string;

  githubAuthId?: string;

  accountType: AccountType;

  constructor(
    id: string,
    login: string,
    email: string,
    createdAt: Date,
    isDeleted: boolean,
    accountType: AccountType,
    passwordHash?: string,
    googleAuthId?: string,
    githubAuthId?: string,
  ) {
    this.id = id;
    this.login = login;
    this.email = email;
    this.createdAt = createdAt;
    this.passwordHash = passwordHash;
    this.isDeleted = isDeleted;
    this.googleAuthId = googleAuthId;
    this.githubAuthId = githubAuthId;
    this.accountType = accountType;
  }
}
