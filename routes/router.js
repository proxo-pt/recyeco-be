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
router.put("/resetpassword/:iduser",auth.resetpassword)

//user no login
router.get("/profil",user.getprofil)
router.get("/postingan",user.postingan) 
router.get("/postingan/postinganByJenis",user.postinganByJenis)
router.get("/postingan/detailPostingan",user.detailPostingan)


//user login
router.post("/logout/:iduser",verify,user.logout)
router.get("/profil/:iduser",verify,user.myprofil)
router.put("/profil/:iduser/editusername",verify,user.editusername)
router.put("/profil/:iduser/editemail",verify,user.editemail)
router.post("/profil/:iduser/addttl",verify,user.addttl)
router.post("/profil/:iduser/addjk",verify,user.addjk)
router.post("/profil/:iduser/addfoto",verify,upload.single("foto"),user.addfoto)
router.post("/postingan/addkeranjang/:iduser",verify,user.addKeranjang)
router.get("/keranjang/:iduser",verify,user.keranjang)

    //jual
    router.post("/addpostingan/:iduser",verify,upload.single("foto"),user.addpostingan)
    router.get("/manajemenProduk/:iduser",verify,user.myPostingan)
    //beli
    router.post("/postingan/detailPostingan/:idpostingan/beli/:iduser",verify,user.beli)

    //dashboard
    router.get("/dashboard/totalproduk/:iduser",verify,user.totalproduk)
    router.get("/dashboard/totalprodukterjual/:iduser",verify,user.totalprodukterjual)
    router.post("/dashboard/totalpendapatan/:iduser",verify,user.totalpendapatan)

// 

//admin
router.get("/status",admin.status)

module.exports=router