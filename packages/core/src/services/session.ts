import ms from "ms";

import { Database } from "../lib/database";
import { MsTimeValue } from "../lib/types";
import { GenerateId } from "../lib/generate-id";

export class SessionServices {
  private database: Database;
  private expiresIn: number;

  constructor(database: Database, expiresIn: MsTimeValue) {
    this.expiresIn = ms(expiresIn);
    this.database = database;
  }

  async create(
    userId: string,
    options: {
      restricted?: boolean;
      limited?: boolean;
    } = {}
  ) {
    const session = await this.database.createSession({
      id: GenerateId(),
      userId,
      expiresAt: Date.now() + this.expiresIn,
      restricted: options.restricted ?? false,
      limited: options.limited ?? false,
    });
    return session;
  }

  async refresh(sessionId: string) {
    await this.database.updateSession(sessionId, {
      expiresAt: Date.now() + this.expiresIn,
    });
  }

  async validate(id: string) {
    const session = await this.database.findSessionById(id);
    if (!session) return null;
    const user = await this.database.findUserById(session.userId);
    const now = Date.now();
    if (!user || session.expiresAt < now) {
      await this.database.deleteSession(id);
      return null;
    }
    return { user, session };
  }

  async invalidate(id: string) {
    await this.database.deleteAllCodes(id);
    const session = await this.database.deleteSession(id);
    return session;
  }

  async deleteAll(userId: string) {
    await this.database.deleteAllSessions(userId);
  }
}
