import { DataSourceOptions } from 'typeorm';

export function DbConnection(): DataSourceOptions {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../Domain/Entities/**/*.{js,ts}'],
    synchronize: false,
    logging: !isProduction,
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    extra: {
      connectionLimit: 1,
    },
  };
}
