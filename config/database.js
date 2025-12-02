import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL connected with Sequelize');
  } catch (error) {
    logger.error('Database connection failed:', error.message);
    process.exit(1);
  }
};
