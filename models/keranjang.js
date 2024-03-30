const {sequelize,DataTypes}= require("sequelize")
const db = require("../config/database")
const user = require("./user")
const postingan = require("../models/postingan")

const keranjang = db.define(
    "keranjang",
    {
        iduser:{
            type:DataTypes.INTEGER
        },
        idpostingan:{
            type:DataTypes.INTEGER
        }
    },{
        freezeTableName:true
    }
)
    keranjang.belongsTo(postingan,{foreignKey:"idpostingan"})

module.exports=keranjang