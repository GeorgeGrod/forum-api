import "dotenv/config";
import jwt from "jsonwebtoken";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined`);
  }
  return value;
}

const accessTokenSecret = getEnv("JWT_ACCESS_SECRET");
const refreshTokenSecret = getEnv("JWT_REFRESH_SECRET");

export function signAccessToken(userId: number) {
  return jwt.sign({}, accessTokenSecret, {
    algorithm: "HS256",
    subject: String(userId),
    expiresIn: "15m",
  });
}

export function signRefreshToken(userId: number) {
  return jwt.sign(
    { type: "refresh" },
    refreshTokenSecret,
    {
      algorithm: "HS256",
      subject: String(userId),
      expiresIn: "7d",
    },
  );
}

export function verifyAccessToken(token: string): number {
  try {
    const payload = jwt.verify(token, accessTokenSecret, {
      algorithms: ["HS256"],
    });

    if (typeof payload === "string" || typeof payload.sub !== "string") {
      throw new Error();
    }

    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("INVALID_ACCESS_TOKEN");
    }

    return userId;
  } catch {
    throw new Error("INVALID_ACCESS_TOKEN");
  }
}

export function verifyRefreshToken(token: string): number {
  try {
    const payload = jwt.verify(token, refreshTokenSecret, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      payload.type !== "refresh"
    ) {
      throw new Error();
    }

    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    return userId;
  } catch {
    throw new Error("INVALID_REFRESH_TOKEN");
  }
}