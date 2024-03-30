const { Sequelize , DataTypes} = require("sequelize")
const db = require("../config//database")
// const postingan = require("./postingan")
// const riwayat = require("./riwayat")
// const tukarpoint = require("./tukarpoint")
// const event = require("./event")
// const keranjang = require("./keranjang")

const User = db.define(
    "user",
    {
    username:{
        type: DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    foto:{
        type:DataTypes.STRING
    },
    role:{
        type:DataTypes.ENUM("Admin","User"),
        defaultValue: "user"
    },
    point:{
        type:DataTypes.INTEGER
    },
    token:{
        type:DataTypes.STRING
    },
    ttl:{
        type:DataTypes.STRING
    },
    jk:{
        type:DataTypes.STRING
    }
},{
    freezeTableName:true
});


module.exports=User
