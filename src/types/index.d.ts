export interface SessionFlags {
  twoFactorVerified: boolean;
}

export interface Session extends SessionFlags {
  id: string;
  expiresAt: Date;
  userId: string;
}

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export interface User {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  registered2FA: boolean;
}

export interface EmailVerificationRequest {
  id: string;
  userId: string;
  code: string;
  email: string;
  expiresAt: Date;
}

export interface PasswordResetSession {
  id: string;
  userId: number;
  email: string;
  expiresAt: Date;
  code: string;
  emailVerified: boolean;
  twoFactorVerified: boolean;
}

export type PasswordResetSessionValidationResult =
  | { session: PasswordResetSession; user: User }
  | { session: null; user: null };
