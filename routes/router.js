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
router.get("/postingan",user.postingan) 
router.get("/postingan/postinganByJenis",user.postinganByJenis)
router.get("/postingan/detailPostingan",user.detailPostingan)
router.get("/postingan/search",user.search)


//user login
router.post("/logout/",verify,user.logout)
router.get("/profile",verify,user.myprofil)
router.put("/profil/edit",verify,upload.single("foto"),user.edituser)
router.post("/postingan/addkeranjang",verify,user.addKeranjang)
router.get("/keranjang",verify,user.keranjang)
router.post("/daftartoko",verify,user.daftartoko)


    //jual
    router.post("/addpostingan",verify,upload.single("foto"),user.addpostingan)
    router.get("/manajemenProduk",verify,user.myPostingan)
    //beli
    router.post("/postingan/detailPostingan/beli/:idpostingan",verify,user.beli)

    //dashboard
    router.get("/dashboard/totalproduk",verify,user.totalproduk)
    router.get("/dashboard/totalprodukterjual",verify,user.totalprodukterjual)
    router.get("/dashboard/totalpendapatan",verify,user.totalpendapatan)
    router.get("/dashboard/verifikasi",verify,user.getverifikasi)
    router.put('/dashboard/verifikasi/:idverif', verify,user.verifikasi);
    router.get("/dashboard/allverif",user.veri)
// 

//admin
router.get("/status",admin.status)

module.exports=router