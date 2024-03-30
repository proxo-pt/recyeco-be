const {sequelize,DataTypes}= require("sequelize")
const db = require("../config/database")
const user = require("./user")

const requestevent = db.define(
    "requestevent",
    {
        pelaksana:{
            type:DataTypes.INTEGER
        },
        judul:{
            type:DataTypes.STRING
        },
        reward_point:{
            type:DataTypes.INTEGER
        },
        kuota:{
            type:DataTypes.INTEGER
        },
        foto:{
            type:DataTypes.STRING
        },
        waktu:{
            type:DataTypes.STRING
        },
        lokasi:{
            type:DataTypes.STRING
        }
    },{
        freezeTableName:true
    }
)

requestevent.belongsTo(user,{foreignKey:"pelaksana"})


module.exports=requestevent