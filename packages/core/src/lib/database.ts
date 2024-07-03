import type { CodeData, CodeActionValue, SessionData, UserData } from "./types";

export interface DatabaseOptions {
  findUserByUsername: (username: string) => Promise<UserData | null>;
  findUserByEmail: (email: string) => Promise<UserData | null>;
  findUserByEmailOrUsername: (data: {
    email?: string;
    username?: string;
  }) => Promise<UserData | null>;
  createUser: (data: UserData) => Promise<UserData>;
  createCode: (data: CodeData) => Promise<CodeData>;
  findSessionCodes: (
    sessionId: string,
    action: CodeActionValue | string
  ) => Promise<CodeData[]>;
  deleteCode: (id: string) => Promise<void>;
  deleteAllCodes: (sessionId: string) => Promise<void>;
  createSession: (data: SessionData) => Promise<SessionData>;
  updateSession: (id: string, data: Partial<SessionData>) => Promise<void>;
  findUserById: (id: string) => Promise<UserData | null>;
  findSessionById: (id: string) => Promise<SessionData | null>;
  deleteSession: (id: string) => Promise<void>;
  deleteAllSessions: (userId: string) => Promise<void>;
}

export class Database {
  readonly findUserByUsername: (username: string) => Promise<UserData | null>;
  readonly findUserByEmail: (email: string) => Promise<UserData | null>;
  readonly findUserByEmailOrUsername: (data: {
    email?: string;
    username?: string;
  }) => Promise<UserData | null>;
  readonly createUser: (data: UserData) => Promise<UserData>;
  readonly createCode: (data: CodeData) => Promise<CodeData>;
  readonly findSessionCodes: (
    userId: string,
    action: CodeActionValue | string
  ) => Promise<CodeData[]>;
  readonly deleteCode: (id: string) => Promise<void>;
  readonly deleteAllCodes: (sessionId: string) => Promise<void>;
  readonly createSession: (data: SessionData) => Promise<SessionData>;
  readonly updateSession: (
    id: string,
    data: Partial<SessionData>
  ) => Promise<void>;
  readonly findUserById: (id: string) => Promise<UserData | null>;
  readonly findSessionById: (id: string) => Promise<SessionData | null>;
  readonly deleteSession: (id: string) => Promise<void>;
  readonly deleteAllSessions: (userId: string) => Promise<void>;

  constructor(options: DatabaseOptions) {
    this.findUserByUsername = options.findUserByUsername;
    this.findUserByEmail = options.findUserByEmail;
    this.findUserByEmailOrUsername = options.findUserByEmailOrUsername;
    this.createUser = options.createUser;
    this.createCode = options.createCode;
    this.findSessionCodes = options.findSessionCodes;
    this.deleteCode = options.deleteCode;
    this.deleteAllCodes = options.deleteAllCodes;
    this.createSession = options.createSession;
    this.updateSession = options.updateSession;
    this.findUserById = options.findUserById;
    this.findSessionById = options.findSessionById;
    this.deleteSession = options.deleteSession;
    this.deleteAllSessions = options.deleteAllSessions;
  }
}
