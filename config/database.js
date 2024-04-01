const sequelize = require("sequelize")

const dbName = "railway";
const dbUser = "root";
const dbPassword = "onBiIqMuvcfxIdvtprFxbbbVlmxDiTZa";
const dbHost = "viaduct.proxy.rlwy.net";

const db = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "mysql"
});
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