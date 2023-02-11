import * as crypto from "crypto";

export function generateToken(tokenLength: number): string {
  return crypto
    .randomBytes(tokenLength)
    .toString("hex")
    .slice(0, tokenLength)
    .toUpperCase();
}
