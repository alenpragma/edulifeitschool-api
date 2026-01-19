import fs from "node:fs";
import path from "node:path";
import { prisma } from "../../config/prisma";
import { UpsertInput } from "./site-setting.type";
import config from "../../config/env";
import { SiteSetting } from "../../generated/prisma/client";

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export const upsertSiteSetting = async (
  { key, value }: UpsertInput,
  file: Express.Multer.File | null
) => {
  let updatedValue = value;

  if (key === "hero" && file) {
    const heroFile = file as Express.Multer.File & { publicPath: string };

    const oldSetting = await prisma.siteSetting.findUnique({ where: { key } });

    if (
      oldSetting?.value &&
      typeof oldSetting.value === "object" &&
      !Array.isArray(oldSetting.value) &&
      "heroImage" in oldSetting.value
    ) {
      const oldPath = path.join(
        process.cwd(),
        "public",
        (oldSetting.value as Record<string, any>).heroImage
      );
      try {
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (err) {
        console.error("Failed to delete old hero image:", err);
      }
    }

    updatedValue =
      typeof value === "object" && !Array.isArray(value)
        ? { ...(value as Record<string, any>), heroImage: heroFile.publicPath }
        : { heroImage: heroFile.publicPath };
  }

  const upserted = await prisma.siteSetting.upsert({
    where: { key },
    update: { value: updatedValue },
    create: { key, value: updatedValue },
  });

  return upserted;
};

export const getSiteSettings = async () => {
  const settings = await prisma.siteSetting.findMany();

  return Object.fromEntries(
    settings.map((s: SiteSetting) => {
      if (
        s.key === "hero" &&
        isObject(s.value) &&
        typeof s.value.heroImage === "string"
      ) {
        return [
          s.key,
          {
            ...s.value,
            heroImage: `${config.BASE_URL}${s.value.heroImage}`,
          },
        ];
      }

      return [s.key, s.value];
    })
  );
};
