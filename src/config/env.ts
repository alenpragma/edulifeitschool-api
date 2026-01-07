import { configDotenv } from "dotenv";

configDotenv(); // Load env vars from .env file

// Centralized env config with safe defaults
const config: {
  NODE_ENV: string;
  PORT: number;
  JWT_SECRET: string;
  BASE_URL: string;
  DATABASE_URL: string;
  SMTP_URL: string;
  CLIENT_URLS: string[];
} = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "dev",
  BASE_URL: process.env.BASE_URL || "http://localhost:4000",
  DATABASE_URL:
    process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/db",
  SMTP_URL: process.env.SMTP_URL || "smtp://localhost:1025",
  CLIENT_URLS: (process.env.CLIENT_URLS || "http://localhost:3000").split(","),
};

export default config;
