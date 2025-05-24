import jwt, { Secret, SignOptions } from "jsonwebtoken";

// Generate JWT
const generateToken = (
  payload: string | object | Buffer,
  secret: Secret, 
  expiresIn: SignOptions['expiresIn']
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
};

// Decode JWT
const decodedToken = (
  token: string,
  secret: Secret
): string | jwt.JwtPayload => {
  return jwt.verify(token, secret);
};

export const jwtHelper = {
  generateToken,
  decodedToken,
};
