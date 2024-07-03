import CryptoJS from "crypto-js";

export class PasswordServices {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async hash(password: string) {
    const hash = CryptoJS.AES.encrypt(password, this.secret).toString();
    return hash;
  }

  async verify(password: string, hashPassword: string) {
    const unhash = CryptoJS.AES.decrypt(hashPassword, this.secret).toString(
      CryptoJS.enc.Utf8
    );
    return unhash === password;
  }
}
