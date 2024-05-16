import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import User from './user.js';

const Toko = db.define(
  'toko',
  {
    pemilik: {
      type: DataTypes.INTEGER
    },
    toko: {
      type: DataTypes.STRING
    },
    kontak: {
      type: DataTypes.STRING
    },
    lokasi: {
      type: DataTypes.STRING
    },
    link_map: {
      type: DataTypes.STRING
    }
  },
  {
    freezeTableName: true
  }
);

Toko.belongsTo(User, { foreignKey: 'pemilik' });

export default Toko;
