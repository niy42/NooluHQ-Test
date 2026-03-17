import crypto from "crypto";

export function generateOtp(length: number = 6): string {
  const max = Math.pow(10, length);
  const min = Math.pow(10, length - 1);
  const otpNumber = crypto.randomInt(min, max);
  return otpNumber.toString().padStart(length, "0");
}
