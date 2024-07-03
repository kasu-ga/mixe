import { AuthServices } from "../services/authentication";
import { MsTimeValue } from "./types";
import { TokenServices } from "../services/tokens";
import { Database } from "./database";
import { SessionServices } from "../services/session";
import { CodeServices } from "../services/codes";
import { UtilServices } from "../services/utils";
import { PasswordServices } from "../services/passwords";

export interface MixeOptions {
  session?: {
    expiresIn?: MsTimeValue;
  };
  codes?: {
    expiresIn?: MsTimeValue;
  };
  secret: string;
}

export class Mixe {
  readonly authentication: AuthServices;
  readonly tokens: TokenServices;
  readonly session: SessionServices;
  readonly codes: CodeServices;
  readonly utils: UtilServices;
  readonly password: PasswordServices;
  readonly db: Database;

  constructor(
    database: Database,
    { secret, codes = {}, session = {} }: MixeOptions
  ) {
    this.db = database;
    this.password = new PasswordServices(secret);
    this.session = new SessionServices(database, session.expiresIn ?? "1d");
    this.tokens = new TokenServices(this.session, secret);
    this.codes = new CodeServices(
      this.password,
      database,
      codes.expiresIn ?? "15m"
    );
    this.utils = new UtilServices(this.codes);
    this.authentication = new AuthServices({
      codes: this.codes,
      database,
      passwords: this.password,
      session: this.session,
      tokens: this.tokens,
    });
  }
}
