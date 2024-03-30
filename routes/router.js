const express = require("express")
const router = express.Router()
const auth = require("../controllers/auth")
const user = require("../controllers/user")
const upload = require("../middlewares/upload")
const verify = require("../middlewares/verify-token")
const admin = require("../controllers/admin")

//auth
router.post("/register",upload.single("foto"), auth.register)
router.post("/login",auth.login)
router.post("/sendemail",auth.sendemail)
router.put("/:iduser/resetpassword",auth.resetpassword)

//user no login
router.get("/profil",user.getprofil)
router.get("/postingan",user.postingan) 
router.get("/postinganByJenis",user.postinganByJenis)
router.get("/detailPostingan",user.detailPostingan)


//user login
router.post("/:iduser/logout",verify,user.logout)
router.get("/:iduser/myprofil",verify,user.myprofil)
router.post("/:iduser/addpostingan",verify,upload.single("foto"),user.addpostingan)
router.post("/:iduser/addkeranjang",user.addKeranjang)
router.get("/:iduser/keranjang",user.keranjang)
// 

//admin
router.get("/status",admin.status)

module.exports=router