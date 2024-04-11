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
router.put("/resetpassword",verify,auth.resetpassword)

//user no login
router.get("/postingan",user.postingan) 
router.get("/postingan/postinganByJenis",user.postinganByJenis)
router.get("/postingan/detail",user.detailPostingan)
router.get("/postingan/search",user.search)


//user login
router.post("/logout/",verify,user.logout)
router.get("/profile",verify,user.myprofil)
router.put("/profil/edit",verify,upload.single("foto"),user.edituser)
router.post("/postingan/addkeranjang",verify,user.addKeranjang)
router.get("/keranjang",verify,user.keranjang)
router.post("/daftartoko",verify,upload.single("foto"),user.daftartoko)
router.get("/daftartoko",verify,user.getTokoById)


    //toko
    router.post("/addpostingan",verify,upload.single("foto"),user.addpostingan)
    router.get("/manajemenProduk",verify,user.myPostingan)
        //manejemen produk
        router.get("/manajemen",verify,user.manajemen)
        router.get("/manajemen/search",verify,user.searchproduk)
        router.put("/manajemen/edit/:idpostingan",verify,upload.single("foto"),user.editproduk)
        router.delete("/manajemen/delete/:idpostingan",verify,user.deleteproduk)
        
    //beli
    router.post("/postingan/detailPostingan/beli/:idpostingan",verify,user.beli)

    //dashboard
    router.get("/dashboard/totalproduk",verify,user.totalproduk)
    router.get("/dashboard/totalprodukterjual",verify,user.totalprodukterjual)
    router.get("/dashboard/totalpendapatan",verify,user.totalpendapatan)
    router.get("/dashboard/verifikasi",verify,user.getverifikasi)
    router.put('/dashboard/verifikasi/:idverif', verify,user.verifikasi);



//admin
router.get("/status",admin.status)

module.exports=router