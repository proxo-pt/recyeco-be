import { Sequelize } from 'sequelize';
import 'dotenv/config';
import pg from 'pg'

const db = new Sequelize(
  process.env.SUPABASE_DB,
  process.env.SUPABASE_USERNAME,
  process.env.SUPABASE_PASSWORD,
  {
    host: process.env.SUPABASE_HOST,
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
