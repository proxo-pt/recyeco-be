const jwt = require("jsonwebtoken")
const user = require("../models/user")

module.exports = async (req, res, next) => {
try {
const {iduser} = req.params
const datas = await user.findByPk(iduser)
const token = datas.token;
if(!token){
    return res.status(403).json({message:"incorrect credential"})
}

const jwtToken = token.split(' ').pop()
    const data = jwt.verify(jwtToken, "qwertyuiop")

    const akuns = await user.findByPk(data.id)
    if(!akuns){
        return res.status(404).json({message:"akun no found"})
    }
    if (akuns.id !== datas.id) {
        return res.status(403).json({ message: "Harus Login Terlbih Dahulu!" });
    }

    console.log(data.id," dan ",akuns.id)

    req.akun = akuns 
    next()
} catch (error) {
    return res.status(403).json({message:"incorrect credential"})
}

};