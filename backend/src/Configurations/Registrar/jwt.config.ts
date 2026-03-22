import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
  expiresIn: `${process.env.JWT_EXPIRES_IN_MINUTES}m`,
  refreshExpiresIn: `${process.env.JWT_REFRESH_EXPIRES_IN_DAYS}d`,
}));
