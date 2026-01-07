import path from "node:path";
import { prisma } from "../../config/prisma";
import config from "../../config/env";
import { SiteSetting } from "../../generated/prisma/client";

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

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
            heroImage: path.join(config.BASE_URL, s.value.heroImage),
          },
        ];
      }

      return [s.key, s.value];
    })
  );
};
