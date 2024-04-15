import { Sequelize } from "sequelize";

const db = new Sequelize("recyeco-be", "recyeco", "recyeco", {
  host: "localhost",
  dialect: "mysql",
});

try {
  db.authenticate();
  console.log("database terhubung");
  db.sync();
  console.log("tabel terhubung");
} catch (error) {
  console.log("database tidak terhubung", error);
}

export default db;
