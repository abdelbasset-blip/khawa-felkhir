import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL est requise"),
  JWT_ACCESS_SECRET: z.string().min(10, "JWT_ACCESS_SECRET doit comporter au moins 10 caractères"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string().min(10, "JWT_REFRESH_SECRET doit comporter au moins 10 caractères"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
});

export const env = envSchema.parse(process.env);
