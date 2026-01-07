import multer, { MulterError } from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

/* -------------------------------------------------------
 Types
-------------------------------------------------------- */

export interface FieldConfig {
  name: string;
  destination: string; // relative to public/
  maxCount?: number;
  allowedMimeTypes?: readonly string[];
  maxSize?: number; // per-field (manual enforcement)
}

/* -------------------------------------------------------
 Constants
-------------------------------------------------------- */

const PUBLIC_UPLOAD_ROOT = path.join(process.cwd(), "public/uploads");

/* -------------------------------------------------------
 Helpers
-------------------------------------------------------- */

const ensureDirExists = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const generateRandomFilename = (originalName: string): string => {
  const ext = path.extname(originalName);
  const random = crypto.randomBytes(16).toString("hex");
  return `${random}${ext}`;
};

/* -------------------------------------------------------
 Factory
-------------------------------------------------------- */

export const createFieldsUploader = (fields: FieldConfig[]) => {
  /** Validate & map fields */
  const fieldMap = new Map<string, FieldConfig>();

  fields.forEach((field) => {
    if (path.isAbsolute(field.destination)) {
      throw new Error(
        `Upload destination must be relative: ${field.destination}`
      );
    }
    fieldMap.set(field.name, field);
  });

  /** Multer field config */
  const multerFields: multer.Field[] = fields.map((f) => ({
    name: f.name,
    maxCount: f.maxCount ?? 1,
  }));

  /** Global max size (multer limitation) */
  const globalMaxSize =
    Math.max(...fields.map((f) => f.maxSize ?? 0)) || 5 * 1024 * 1024;

  /* -------------------------------------------------------
   Storage
  -------------------------------------------------------- */

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const field = fieldMap.get(file.fieldname);

      if (!field) {
        return cb(new MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname), "");
      }

      const finalDestination = path.join(PUBLIC_UPLOAD_ROOT, field.destination);

      ensureDirExists(finalDestination);
      cb(null, finalDestination);
    },

    filename(req, file, cb) {
      const field = fieldMap.get(file.fieldname)!;
      const filename = generateRandomFilename(file.originalname);

      /** Attach public path for later use */
      (file as any).publicPath = path
        .join(field.destination, filename)
        .replace(/\\/g, "/");

      cb(null, filename);
    },
  });

  /* -------------------------------------------------------
   Multer Instance
  -------------------------------------------------------- */

  const uploader = multer({
    storage,

    fileFilter(req, file, cb) {
      const field = fieldMap.get(file.fieldname);

      if (!field) {
        return cb(new MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
      }

      if (
        field.allowedMimeTypes &&
        !field.allowedMimeTypes.includes(file.mimetype)
      ) {
        return cb(
          new MulterError(
            "LIMIT_UNEXPECTED_FILE",
            `Invalid mime type for ${file.fieldname}: ${file.mimetype}`
          )
        );
      }

      cb(null, true);
    },

    limits: {
      fileSize: globalMaxSize,
      files: fields.reduce((sum, f) => sum + (f.maxCount ?? 1), 0),
    },
  }).fields(multerFields);

  return uploader;
};

/* -------------------------------------------------------
 Per-field size enforcement (middleware)
-------------------------------------------------------- */

export const enforceFieldSizes =
  (fields: FieldConfig[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Record<string, Express.Multer.File[]>;

    if (!files) return next();

    for (const field of fields) {
      if (!field.maxSize) continue;

      const uploadedFiles = files[field.name] ?? [];

      for (const file of uploadedFiles) {
        if (file.size > field.maxSize) {
          fs.unlinkSync(file.path);
          return res.status(400).json({
            message: `${field.name} exceeds maximum size`,
          });
        }
      }
    }

    next();
  };
