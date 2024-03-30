const {sequelize,DataTypes}= require("sequelize")
const db = require("../config/database")
const user = require("./user")

const tukarpoint = db.define(
    "tukarpoint",
    {
        iduser:{
            type:DataTypes.INTEGER
        },
        namareward:{
            type:DataTypes.STRING
        },
        foto:{
            type:DataTypes.STRING
        },
        point:{
            type:DataTypes.INTEGER
        }
    },{
        freezeTableName:true
    }
)

    tukarpoint.belongsTo(user,{foreignKey:"iduser"})

module.exports=tukarpoint