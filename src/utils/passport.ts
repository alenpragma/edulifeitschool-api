import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import config from "../config/env";
import { PassportStatic } from "passport";
import { prisma } from "../config/prisma";

export default function initializePassport(passport: PassportStatic) {
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(opts, async (jwt_payload: { id: number }, done) => {
      try {
        // Find user by id using Prisma
        const user = await prisma.user.findUnique({
          where: { id: jwt_payload.id },
          select: { id: true, role: true }, // only select necessary fields
        });

        if (user) return done(null, user); // attach user to req.user
        return done(null, false); // user not found
      } catch (err) {
        return done(err as Error, false);
      }
    })
  );
}
