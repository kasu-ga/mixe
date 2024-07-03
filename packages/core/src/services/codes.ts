import ms from "ms";

import { Database } from "../lib/database";
import { CodeActionValue, MsTimeValue } from "../lib/types";
import { GenerateId } from "../lib/generate-id";
import { PasswordServices } from "./passwords";

export class CodeServices {
  private database: Database;
  private passwords: PasswordServices;
  private expiresIn: number;

  constructor(
    passwords: PasswordServices,
    database: Database,
    expiresIn: MsTimeValue
  ) {
    this.database = database;
    this.expiresIn = ms(expiresIn);
    this.passwords = passwords;
  }

  async generate() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async create(sessionId: string, action: CodeActionValue | string) {
    const code = await this.generate();
    const hashCode = await this.passwords.hash(code);
    await this.database.createCode({
      id: GenerateId(),
      sessionId,
      expiresAt: Date.now() + this.expiresIn,
      value: hashCode,
      action,
    });
    return code;
  }

  async validate(
    sessionId: string,
    inputAction: CodeActionValue | string,
    inputCode: string
  ) {
    const now = Date.now();
    const codes = await this.database.findSessionCodes(sessionId, inputAction);
    for (const code of codes) {
      const { expiresAt, value } = code;
      if (expiresAt < now) {
        await this.database.deleteCode(code.id);
        continue;
      }
      const valid = await this.passwords.verify(inputCode, value);
      if (!valid) continue;
      await this.database.deleteCode(code.id);
      return true;
    }
    return false;
  }

  async deleteAll(userId: string) {
    await this.database.deleteAllCodes(userId);
  }
}
