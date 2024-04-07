const {sequelize,DataTypes}= require("sequelize")
const db = require("../config/database")
const postingan = require("./postingan")

const verifikasi = db.define(
    "verifikasi",
    {
        pembeli:{
            type:DataTypes.STRING
        },
        idpostingan:{
            type:DataTypes.INTEGER
        },
    },{
        freezeTableName:true
    }
)

verifikasi.belongsTo(postingan,{foreignKey:"idpostingan"})

module.exports=verifikasi