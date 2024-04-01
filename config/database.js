const sequelize = require("sequelize")

const db = new sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
    host:process.env.DB_HOST,
    dialect:"mysql"
})

try{
db.authenticate()
console.log("database terhubung")
db.sync()
console.log("tabel terhubung")
}
catch(error){
    console.log("databse tidak terhubung",error)
}

module.exports=db