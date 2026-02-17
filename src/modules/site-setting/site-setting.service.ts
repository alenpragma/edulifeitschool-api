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
  files: Record<string, Express.Multer.File[]> | null,
) => {
  const oldSetting = await prisma.siteSetting.findUnique({ where: { key } });

  let updatedValue: any = oldSetting?.value ?? null;

  // Merge objects, replace everything else
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    updatedValue &&
    typeof updatedValue === "object" &&
    !Array.isArray(updatedValue)
  ) {
    updatedValue = { ...updatedValue, ...value };
  } else if (value !== undefined) {
    updatedValue = value;
  }

  // Ensure we have an object before image logic
  if (
    !updatedValue ||
    typeof updatedValue !== "object" ||
    Array.isArray(updatedValue)
  ) {
    updatedValue = {};
  }

  // Handle hero image
  if (key === "hero" && files?.heroImage?.length) {
    const heroFile = files["heroImage"][0] as Express.Multer.File & {
      publicPath: string;
    };

    if (updatedValue.heroImage) {
      const oldPath = path.join(
        process.cwd(),
        "public",
        updatedValue.heroImage,
      );
      try {
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (err) {
        console.error("Failed to delete old hero image:", err);
      }
    }

    updatedValue.heroImage = heroFile.publicPath;
  }

  // Handle banner image
  if (key === "whyChooseUs" && files?.bannerImage?.length) {
    const bannerFile = files["bannerImage"][0] as Express.Multer.File & {
      publicPath: string;
    };

    if (updatedValue.bannerImage) {
      const oldPath = path.join(
        process.cwd(),
        "public",
        updatedValue.bannerImage,
      );
      try {
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (err) {
        console.error("Failed to delete old banner image:", err);
      }
    }

    updatedValue.bannerImage = bannerFile.publicPath;
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
      if (isObject(s.value)) {
        // Hero image
        if (s.key === "hero" && typeof s.value.heroImage === "string") {
          return [
            s.key,
            { ...s.value, heroImage: `${config.BASE_URL}${s.value.heroImage}` },
          ];
        }

        // Banner image for whyChooseUs
        if (
          s.key === "whyChooseUs" &&
          typeof s.value.bannerImage === "string"
        ) {
          return [
            s.key,
            {
              ...s.value,
              bannerImage: `${config.BASE_URL}${s.value.bannerImage}`,
            },
          ];
        }
      }

      return [s.key, s.value];
    }),
  );
};
