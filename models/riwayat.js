const {sequelize,DataTypes}= require("sequelize")
const db = require("../config/database")
const user = require("./user")

const riwayat = db.define(
    "riwayat",
    {
        idevent:{
            type:DataTypes.INTEGER
        },
        idtukarpoint:{
            type:DataTypes.INTEGER
        }
    },{
        freezeTableName:true
    }
)

    riwayat.belongsTo(user,{foreignKey:"idtukarpoint"})

module.exports=riwayat