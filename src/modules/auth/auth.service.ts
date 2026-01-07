import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError";
import config from "../../config/env";
import { prisma } from "../../config/prisma";
import { LoginInput } from "./auth.types";

export const login = async ({
  email,
  password,
}: LoginInput): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(400, "Invalid Email or Password");
  }

  const accessToken = jwt.sign({ id: user.id }, config.JWT_SECRET, {
    expiresIn: "30d",
  });

  return accessToken;
};

export const me = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const { passwordHash, ...safeUser } = user; // Remove passwordHash safely

  return safeUser;
};
