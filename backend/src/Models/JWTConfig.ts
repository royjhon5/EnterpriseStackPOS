export class JWTConfig {
  validIssuer?: string;
  validAudience?: string;
  secret?: string;
  tokenValidityInMinutes?: number;
  refreshTokenValidityInDays?: number;
}
