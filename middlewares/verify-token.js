const jwt = require("jsonwebtoken")
const user = require("../models/user")

module.exports = async (req, res, next) => {

    const token = req.cookies.token;

    if(!token){
    return res.status(404).json({message:"incorrect credential"})
    }

    try {
// const {iduser} = req.params
// const datas = await user.findByPk(iduser)

const jwtToken = token.split(' ').pop()
    const data = jwt.verify(jwtToken, "qwertyuiop")

    // const akuns = await user.findByPk(data.id)
    // if(!akuns){
    //     return res.status(404).json({message:"user no found"})
    // }
    // if (akuns.id !== datas.id) {
    //     return res.status(400).json({ message: "Harus Login Terlbih Dahulu!" });
    // }
    if(data === null){
        return res.status(404).json({message:"incorrect credential"})
    }
    console.log("nih data cuy",data)

    req.akun = data
    next()
} catch (error) {
    return res.status(403).json({message:"incorrect credential"})
}

};