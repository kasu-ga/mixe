import { Database } from "../lib/database";
import { MixeError } from "../lib/errors";
import { CodeActionValue, SessionData, UserData } from "../lib/types";
import { CodeServices } from "./codes";
import { PasswordServices } from "./passwords";
import { SessionServices } from "./session";
import { TokenServices, TokenType } from "./tokens";

export interface AuthFlowResult {
  session: SessionData;
  user: UserData;
  access_token: string;
  refresh_token: string;
  restricted: boolean;
}

export interface AuthServiceOptions {
  database: Database;
  codes: CodeServices;
  session: SessionServices;
  passwords: PasswordServices;
  tokens: TokenServices;
}

export class AuthServices {
  private database: Database;
  private codes: CodeServices;
  private session: SessionServices;
  private passwords: PasswordServices;
  private tokens: TokenServices;

  constructor(options: AuthServiceOptions) {
    this.database = options.database;
    this.codes = options.codes;
    this.session = options.session;
    this.passwords = options.passwords;
    this.tokens = options.tokens;
  }

  async usernameOrEmailExists(data: { username?: string; email?: string }) {
    let emailExists = false;
    let usernameExists = false;
    if (data.username) {
      data.username = data.username.toLowerCase().trim();
      const exists = await this.database.findUserByUsername(data.username);
      usernameExists = Boolean(exists);
    }
    if (data.email) {
      data.email = data.email.toLowerCase().trim();
      const exists = await this.database.findUserByEmail(data.email);
      emailExists = Boolean(exists);
    }
    if (emailExists && usernameExists)
      throw new MixeError("Username and email already in use.", {
        username: ["username already in use."],
        email: ["email already in use."],
      });
    if (emailExists)
      throw new MixeError("Email already in use.", {
        email: ["email already in use."],
      });
    if (usernameExists)
      throw new MixeError("Username already in use.", {
        username: ["username already in use."],
      });
  }

  async validate2FACode(sessionId: string, inputCode: string) {
    return await this.codes.validate(
      sessionId,
      CodeActionValue.TwoFactorsAuth,
      inputCode
    );
  }

  async create2FACode(sessionId: string) {
    const code = await this.codes.create(
      sessionId,
      CodeActionValue.TwoFactorsAuth
    );
    return code;
  }

  async signin({
    password,
    ...data
  }: (
    | {
        username: string;
      }
    | {
        email: string;
      }
  ) & {
    password: string;
  }): Promise<AuthFlowResult> {
    if ("email" in data) data.email = data.email.toLowerCase().trim();
    if ("username" in data) data.username = data.username.toLowerCase().trim();
    const user = await this.database.findUserByEmailOrUsername(data);
    if (!user) throw new MixeError("User not found.");
    const isPasswordMath = await this.passwords.verify(password, user.password);
    if (!isPasswordMath) throw new MixeError("Password is invalid.");
    const restricted = user.enable2FA ?? false;
    const session = await this.session.create(user.id, { restricted });
    const { access_token, refresh_token } = await this.tokens.generate(
      session.id
    );
    return {
      access_token,
      refresh_token,
      user,
      session,
      restricted,
    };
  }

  async signup(data: UserData): Promise<AuthFlowResult> {
    await this.usernameOrEmailExists(data);
    const user = await this.database.createUser({
      ...data,
      password: await this.passwords.hash(data.password),
    });
    const session = await this.session.create(user.id);
    const { access_token, refresh_token } = await this.tokens.generate(
      session.id
    );
    return {
      access_token,
      refresh_token,
      user,
      restricted: false,
      session,
    };
  }
}
