import * as bcrypt from 'bcrypt';

export class BcryptService {
  async generateHash(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }
}
