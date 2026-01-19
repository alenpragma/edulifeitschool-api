import fs from "node:fs";
import path from "node:path";
import { prisma } from "../../config/prisma";
import { UpsertInput } from "./site-setting.type";
import config from "../../config/env";
import { SiteSetting } from "../../generated/prisma/client";

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Generic function to handle upsert of site settings.
 * Supports image replacement for any key.
 */
export const upsertSiteSetting = async (
  { key, value }: UpsertInput,
  file: Express.Multer.File | null,
) => {
  let updatedValue = value;

  // Map keys to image fields
  const imageFieldMap: Record<string, string> = {
    hero: "heroImage",
    whyChooseUs: "bannerImage",
    // Add more image keys here if needed
  };

  const imageField = imageFieldMap[key];

  if (imageField && file) {
    const uploadedFile = file as Express.Multer.File & { publicPath: string };

    // Find old setting to delete old image
    const oldSetting = await prisma.siteSetting.findUnique({ where: { key } });

    if (
      oldSetting?.value &&
      isObject(oldSetting.value) &&
      imageField in oldSetting.value
    ) {
      const oldPath = path.join(
        process.cwd(),
        "public",
        (oldSetting.value as Record<string, any>)[imageField],
      );
      try {
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (err) {
        console.error(`Failed to delete old image (${imageField}):`, err);
      }
    }

    updatedValue = isObject(value)
      ? {
          ...(value as Record<string, any>),
          [imageField]: uploadedFile.publicPath,
        }
      : { [imageField]: uploadedFile.publicPath };
  }

  // Upsert setting
  const upserted = await prisma.siteSetting.upsert({
    where: { key },
    update: { value: updatedValue },
    create: { key, value: updatedValue },
  });

  return upserted;
};

/**
 * Fetch all site settings with proper image URLs
 */
export const getSiteSettings = async () => {
  const settings = await prisma.siteSetting.findMany();

  return Object.fromEntries(
    settings.map((s: SiteSetting) => {
      if (isObject(s.value)) {
        const newValue = { ...s.value };

        // Prepend BASE_URL for known image fields
        if (typeof newValue.heroImage === "string") {
          newValue.heroImage = `${config.BASE_URL}${newValue.heroImage}`;
        }
        if (typeof newValue.bannerImage === "string") {
          newValue.bannerImage = `${config.BASE_URL}${newValue.bannerImage}`;
        }

        return [s.key, newValue];
      }

      return [s.key, s.value];
    }),
  );
};
