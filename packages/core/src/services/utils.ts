import { CodeActionValue } from "../lib/types";
import { CodeServices } from "./codes";

export class UtilServices {
  private codes: CodeServices;

  constructor(codes: CodeServices) {
    this.codes = codes;
  }

  async validateVerifyEmailCode(sessionId: string, inputCode: string) {
    return await this.codes.validate(
      sessionId,
      CodeActionValue.VerifyEmail,
      inputCode
    );
  }

  async createVerifyEmailCode(sessionId: string) {
    const code = await this.codes.create(
      sessionId,
      CodeActionValue.VerifyEmail
    );
    return code;
  }

  async validateResetPasswordCode(sessionId: string, inputCode: string) {
    return await this.codes.validate(
      sessionId,
      CodeActionValue.ResetPassword,
      inputCode
    );
  }

  async createResetPasswordCode(sessionId: string) {
    const code = await this.codes.create(
      sessionId,
      CodeActionValue.ResetPassword
    );
    return code;
  }

  async validateChangeEmailCode(sessionId: string, inputCode: string) {
    return await this.codes.validate(
      sessionId,
      CodeActionValue.ChangeEmail,
      inputCode
    );
  }

  async createChangeEmailCode(sessionId: string) {
    const code = await this.codes.create(
      sessionId,
      CodeActionValue.ChangeEmail
    );
    return code;
  }
}
