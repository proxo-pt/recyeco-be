import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import Toko from './toko.js';

const Postingan = db.define(
  'postingan',
  {
    idpenjual: {
      type: DataTypes.INTEGER
    },
    penjual: {
      type: DataTypes.STRING
    },
    judul: {
      type: DataTypes.STRING
    },
    jenis: {
      type: DataTypes.STRING
    },
    deskripsi: {
      type: DataTypes.STRING
    },
    berat: {
      type: DataTypes.DECIMAL
    },
    harga: {
      type: DataTypes.INTEGER
    },
    foto: {
      type: DataTypes.TEXT('long')
    },
    status: {
      type: DataTypes.ENUM('tersedia', 'terjual', 'menunggu')
    }
  },
  {
    freezeTableName: true
  }
);

Postingan.belongsTo(Toko, { foreignKey: 'idpenjual' });

export default Postingan;
