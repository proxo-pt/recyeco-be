const sequelize = require("sequelize")

const db = new sequelize("recyeco","root","",{
    host:"localhost",
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