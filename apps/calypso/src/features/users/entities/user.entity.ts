import { ApiProperty } from '@nestjs/swagger';

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

  googleAuth: boolean;

  githubAuth: boolean;

  constructor(
    id: string,
    login: string,
    email: string,
    createdAt: Date,
    isDeleted: boolean,
    googleAuth: boolean,
    githubAuth: boolean,
    passwordHash?: string,
  ) {
    this.id = id;
    this.login = login;
    this.email = email;
    this.createdAt = createdAt;
    this.passwordHash = passwordHash;
    this.isDeleted = isDeleted;
    this.googleAuth = googleAuth;
    this.githubAuth = githubAuth;
  }
}
