const { Sequelize , DataTypes} = require("sequelize")
const db = require("../config//database")
const user = require("../models/user")

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
        kontak:{
            type:DataTypes.STRING
        },
        foto:{
            type:DataTypes.STRING
        },
        lokasi:{
            type:DataTypes.STRING
        },
        latitude:{
            type:DataTypes.DECIMAL
        },
        longitude:{
            type:DataTypes.DECIMAL
        },
        status:{
            type:DataTypes.ENUM("tersedia","terjual","menunggu")
        }
    },{
        freezeTableName:true
    }
)
postingan.belongsTo(user,{foreignKey:"idpenjual"})


module.exports=postingan