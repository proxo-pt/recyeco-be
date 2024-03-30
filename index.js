const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const db = require("./config/database")
const router = require("./routes/router")
port = 1000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(router)

app.get("/",(req,res)=>{
    console.log("welcome")
    return res.json({message:"welcome"})
})

app.listen(port,()=>{
    console.log(`server berjalan di port ${port}`)
})