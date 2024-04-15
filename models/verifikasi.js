import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Postingan from "./postingan.js";

const Verifikasi = db.define(
  "verifikasi",
  {
    pembeli: {
      type: DataTypes.STRING,
    },
    idpostingan: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);

Verifikasi.belongsTo(Postingan, { foreignKey: "idpostingan" });

export default Verifikasi;
