import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import multer, { StorageEngine } from "multer";
import type { Request } from "express";

type UploadConfig = {
  folder: string;
  filename?: string;
  array?: {
    prefix?: string;
    strategy?: "index" | "uuid";
  };
};

type UploadSelector = (fieldName: string) => UploadConfig;

type MulterFileWithPublicPath = Express.Multer.File & {
  publicPath: string;
};

export const createDynamicUploader = (selector: UploadSelector) => {
  const storage: StorageEngine = multer.diskStorage({
    destination(req, file, cb) {
      const { folder } = selector(file.fieldname);

      const uploadPath = path.join(process.cwd(), "public", "uploads", folder);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      Object.defineProperty(file, "__folder", {
        value: folder,
        enumerable: false,
      });

      cb(null, uploadPath);
    },

    filename(req: Request, file, cb) {
      const config = selector(file.fieldname);
      const ext = path.extname(file.originalname);
      const folder = (file as any).__folder;

      let finalName: string;

      // 🔹 Array upload
      if (config.array) {
        const index = (((req as any).__fileIndex ??= {})[file.fieldname] =
          ((req as any).__fileIndex?.[file.fieldname] ?? -1) + 1);

        if (config.array.strategy === "uuid") {
          finalName = `${
            config.array.prefix ?? file.fieldname
          }-${crypto.randomUUID()}${ext}`;
        } else {
          // default: index
          finalName = `${config.array.prefix ?? file.fieldname}-${
            index + 1
          }${ext}`;
        }
      }
      // 🔹 Static single file
      else if (config.filename) {
        finalName = `${config.filename}${ext}`;
      }
      // 🔹 Fallback (random)
      else {
        finalName = `${crypto.randomBytes(12).toString("hex")}${ext}`;
      }

      (
        file as MulterFileWithPublicPath
      ).publicPath = `/uploads/${folder}/${finalName}`;

      cb(null, finalName);
    },
  });

  return multer({ storage });
};
