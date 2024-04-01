const sequelize = require("sequelize")

const db = new sequelize("railway","root","onBiIqMuvcfxIdvtprFxbbbVlmxDiTZa",{
    host:"viaduct.proxy.rlwy.net",
    port:33998,
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