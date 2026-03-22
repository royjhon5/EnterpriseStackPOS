type EnvValues = Record<string, unknown>;

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function hasEnv(config: EnvValues, key: string): boolean {
  return asTrimmedString(config[key]).length > 0;
}

function requireEnv(config: EnvValues, key: string): void {
  if (!hasEnv(config, key)) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

function requirePositiveNumber(config: EnvValues, key: string): void {
  requireEnv(config, key);

  const value = Number(config[key]);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Environment variable ${key} must be a positive number`);
  }
}

function validateOptionalNumber(config: EnvValues, key: string): void {
  if (!hasEnv(config, key)) return;

  const value = Number(config[key]);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Environment variable ${key} must be a positive number`);
  }
}

function validateCredentialPair(
  config: EnvValues,
  userKey: string,
  passKey: string,
): void {
  const hasUser = hasEnv(config, userKey);
  const hasPass = hasEnv(config, passKey);

  if (hasUser !== hasPass) {
    throw new Error(
      `Environment variables ${userKey} and ${passKey} must be provided together`,
    );
  }
}

export function validateEnvironment(config: EnvValues): EnvValues {
  requireEnv(config, 'JWT_SECRET');
  requireEnv(config, 'JWT_ISSUER');
  requireEnv(config, 'JWT_AUDIENCE');
  requirePositiveNumber(config, 'JWT_EXPIRES_IN_MINUTES');
  requirePositiveNumber(config, 'JWT_REFRESH_EXPIRES_IN_DAYS');

  requireEnv(config, 'DB_HOST');
  requireEnv(config, 'DB_USER');
  requireEnv(config, 'DB_PASSWORD');
  requireEnv(config, 'DB_NAME');
  validateOptionalNumber(config, 'DB_PORT');
  validateOptionalNumber(config, 'DEV_PORT');
  validateOptionalNumber(config, 'PROD_PORT');

  validateCredentialPair(config, 'DEV_SWAGGER_USER', 'DEV_SWAGGER_PASS');
  validateCredentialPair(config, 'PROD_SWAGGER_USER', 'PROD_SWAGGER_PASS');

  return config;
}
