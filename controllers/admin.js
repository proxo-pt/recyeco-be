const user = require("../models/user")
const bcrypt = require("bcrypt")
const postingan = require("../models/postingan")
const riwayat = require("../models/riwayat")
const tukarpoint = require("../models/tukarpoint")
const event = require("../models/event")
const keranjang = require("../models/keranjang")
const requestevent = require("../models/requestevent")
const {Op} = require("sequelize")

module.exports={

    status:async(req,res)=>{
        try {
            const produk = await user.findAll({
                where:{
                    token:{
                        [Op.not]:null
                    } 
                },
                attributes:[
                    "email",
                    "username",
                    "foto",
                    "point",
                    "ttl",
                    "jk"
                ]
            })

            return res.json({online:produk})
        } catch (error) {
            return res.json({message:error})
        }
    },

}