import { DataTypes } from "sequelize";
import db from "../config/database.js";

const User = db.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    foto: {
      type: DataTypes.TEXT('long'),
    },
    role: {
      type: DataTypes.ENUM("toko", "user"),
      defaultValue: "user",
    },
    token: {
      type: DataTypes.STRING,
    },
    birthdate: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default User;
