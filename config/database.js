import { Sequelize } from 'sequelize';
import 'dotenv/config';
import pg from 'pg'

const db = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    dialectModule: pg
  }
);

try {
  db.authenticate();
  console.log('database terhubung');
  db.sync();
  console.log('tabel terhubung');
} catch (error) {
  console.log('database tidak terhubung', error);
}

export default db;
