import { Sequelize } from 'sequelize';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const db = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true
    }
  }
});

try {
  db.authenticate();
  console.log('database terhubung');
  db.sync();
  console.log('tabel terhubung');
} catch (error) {
  console.log('database tidak terhubung', error);
}

export default db;
