import jwt from "jsonwebtoken";

// export function generateJwt(userId: string) {
//   return jwt.sign({ userId }, process.env.JWT_SECRET!, {
//     expiresIn: "7d",
//   });
// }

export function generateAccessToken(userId: number) {
  return jwt.sign(
    {
      userId,
      type: "access",
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "15m",
    },
  );
}

export function generateRefreshToken(userId: number) {
  return jwt.sign(
    {
      userId,
      type: "refresh",
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );
}
