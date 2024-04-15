import { Sequelize } from "sequelize";

const db = new Sequelize(
  process.env.RECYECO_DB,
  process.env.RECYECO_DB_USER,
  process.env.RECYECO_DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.RECYECO_DB_HOST,
    dialectOptions: {
      socketPath: process.env.RECYECO_DB_HOST,
    },
  }
);

try {
  db.authenticate();
  console.log("database terhubung");
  db.sync();
  console.log("tabel terhubung");
} catch (error) {
  console.log("database tidak terhubung", error);
}

export default db;
