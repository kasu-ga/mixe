import * as Jose from "jose";

import { SessionData, UserData } from "../lib/types";
import { SessionServices } from "./session";

export enum TokenType {
  AccessToken = "ACCESS_TOKEN",
  RefreshToken = "REFRESH_TOKEN",
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface TokenPayload {
  sessionId: string;
  type: TokenType;
}

export class TokenServices {
  private session: SessionServices;
  private secret: Uint8Array;

  constructor(session: SessionServices, secret: string) {
    const encoder = new TextEncoder();
    this.session = session;
    this.secret = encoder.encode(secret);
  }

  async refresh(token: string): Promise<
    | (AuthTokens & {
        user: UserData;
        session: SessionData;
      })
    | null
  > {
    const payload = await this.validate(token, TokenType.RefreshToken);
    if (!payload) return null;
    const access_token = await this.create(
      payload.session.id,
      TokenType.AccessToken
    );
    const refresh_token = await this.create(
      payload.session.id,
      TokenType.RefreshToken
    );
    await this.refresh(token);
    return {
      refresh_token,
      access_token,
      ...payload,
    };
  }

  async validate(token: string, type: TokenType) {
    try {
      const { payload } = (await Jose.jwtVerify(token, this.secret)) as {
        payload: TokenPayload;
      };
      if (payload.type !== type) return null;
      const sessionData = await this.session.validate(payload.sessionId);
      return sessionData;
    } catch (error) {
      return null;
    }
  }

  async generate(sessionId: string): Promise<AuthTokens> {
    const access_token = await this.create(sessionId, TokenType.AccessToken);
    const refresh_token = await this.create(sessionId, TokenType.RefreshToken);
    return {
      access_token,
      refresh_token,
    };
  }

  async create(sessionId: string, type: TokenType) {
    const token = await new Jose.SignJWT({
      sessionId,
      type,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .sign(this.secret);
    return token;
  }
}
