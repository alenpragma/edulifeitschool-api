import express, { Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import path from "node:path";
import helmet from "helmet";
import winston from "winston";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import passport from "passport";
import { errorResponse } from "./utils/response";
import ApiError from "./utils/ApiError";
import config from "./config/env";
import initializePassport from "./utils/passport";
import routes from "./routes";

const app = express();
app.use(cors());

// -- Winston config --
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Serve static
app.use(express.static(path.join(process.cwd(), "public")));

// -- Global middlewares --
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
initializePassport(passport);

// HTTP logging
app.use(
  morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }),
);

// Console logging for dev
if (config.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

// -- Routes --
app.use("/", routes);

// --- 404 handler ---
app.use((req: Request, res: Response) => {
  errorResponse(res, { status: 404, message: "Route not found" });
});

// --- Global error handler ---
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    errorResponse(res, {
      status: err.status,
      message: err.message,
      errors: (err as any).errors || null,
    });
  } else if (err instanceof Error) {
    errorResponse(res, {
      status: 500,
      message: err.message,
      errors: null,
    });
  } else {
    errorResponse(res, {
      status: 500,
      message: "Internal Server Error",
      errors: null,
    });
  }
});

export default app;
