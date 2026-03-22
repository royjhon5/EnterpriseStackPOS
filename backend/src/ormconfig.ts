// ormconfig.ts
import 'dotenv/config';
import { DbConnection } from './Settings/DbConnection';
import { DataSource } from 'typeorm';

export default new DataSource(DbConnection());
