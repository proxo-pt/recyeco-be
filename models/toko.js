const { Sequelize , DataTypes} = require("sequelize")
const db = require("../config//database")
const user = require("../models/user")

const toko = db.define(
    "toko",
    {
        pemilik:{
            type:DataTypes.INTEGER
        },
        toko:{
            type:DataTypes.STRING
        },
        kontak:{
            type:DataTypes.STRING
        },
        lokasi:{
            type:DataTypes.STRING
        },
        link_map:{
            type:DataTypes.STRING
        }
    },{
        freezeTableName:true
    }
)

toko.belongsTo(user,{foreignKey:"pemilik"})


module.exports=toko