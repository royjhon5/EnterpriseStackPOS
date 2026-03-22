// src/database/data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { DbConnection } from '../Settings/DbConnection';

export const AppDataSource = new DataSource(DbConnection());
