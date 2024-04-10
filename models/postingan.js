const { Sequelize , DataTypes} = require("sequelize")
const db = require("../config//database")
const toko = require("../models/toko")

const postingan = db.define(
    "postingan",
    {
        idpenjual:{
            type:DataTypes.INTEGER
        },
        penjual:{
            type:DataTypes.STRING
        },
        judul:{
            type:DataTypes.STRING
        },
        jenis:{
            type:DataTypes.STRING
        },
        deskripsi:{
            type:DataTypes.STRING
        },
        berat:{
            type:DataTypes.DECIMAL
        },
        harga:{
            type:DataTypes.INTEGER
        },
        foto:{
            type:DataTypes.STRING
        },
        status:{
            type:DataTypes.ENUM("tersedia","terjual","menunggu")
        }
    },{
        freezeTableName:true
    }
)
postingan.belongsTo(toko,{foreignKey:"idpenjual"})


module.exports=postingan