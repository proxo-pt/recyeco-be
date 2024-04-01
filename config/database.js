const sequelize = require("sequelize")

const dbName = "recyeco";
const dbUser = "root";
const dbPassword = "";
const dbHost = "localhost";

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