import { Encrypter } from "../../data/protocols/encrypter";
import bcrypt from "bcrypt";

export class BcryptAdapter implements Encrypter {
  private readonly salt: number;
  constructor(salt: number = 12) {
    this.salt = salt;
  }
  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}
