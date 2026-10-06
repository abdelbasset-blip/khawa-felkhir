import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";
import { env } from "../config/env";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};

export const REFRESH_COOKIE_NAME = "khawa_refresh_token";

export const getRefreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
  path: "/",
});

export const setRefreshCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_COOKIE_NAME, token, getRefreshCookieOptions());
};

export const clearRefreshCookie = (res: Response): void => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...getRefreshCookieOptions(),
    maxAge: 0,
  });
};
