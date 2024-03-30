const {sequelize,DataTypes}= require("sequelize")
const db = require("../config/database")
const user = require("./user")

const event = db.define(
    "event",
    {
        idreqevent:{
            type:DataTypes.INTEGER
        }
    },{
        freezeTableName:true
    }
)

event.belongsTo(user,{foreignKey:"idreqevent"})


module.exports=event