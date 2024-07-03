export interface UserData {
  id: string;
  username?: string;
  email: string;
  password: string;
  enable2FA?: boolean;
}

export interface SessionData {
  id: string;
  expiresAt: number;
  userId: string;
  restricted: boolean;
  limited: boolean;
}

export enum CodeActionValue {
  TwoFactorsAuth = "TWO_FACTORS_AUTH",
  VerifyEmail = "VERIFY_EMAIL",
  ChangeEmail = "CHANGE_EMAIL",
  ResetPassword = "RESET_PASSWORD",
}

export interface CodeData {
  id: string;
  expiresAt: number;
  action: CodeActionValue | string;
  sessionId: string;
  value: string;
}

export type MsTimeValue =
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | `${number}w`
  | `${number}y`;
