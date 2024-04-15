import express from "express";
const router = express.Router();
import auth from "../controllers/auth.js";
import user from "../controllers/user.js";
import upload from "../middlewares/upload.js";
import verifyToken from "../middlewares/verify-token.js";
import admin from "../controllers/admin.js";

//auth
router.post("/register", upload.single("foto"), auth.register);
router.post("/login", auth.login);
router.post("/sendemail", auth.sendEmail);
router.put("/resetpassword", verifyToken, auth.resetPassword);

//user no login
router.get("/postingan", user.postingan);
router.get("/postingan/postinganByJenis", user.postinganByJenis);
router.get("/postingan/detail", user.detailPostingan);
router.get("/postingan/search", user.search);

//user login
router.post("/logout/", verifyToken, user.logout);
router.get("/profile", verifyToken, user.getProfil);
router.put("/profil/edit", verifyToken, upload.single("foto"), user.editUser);
router.post("/daftartoko", verifyToken, upload.single("foto"), user.daftarToko);
router.get("/daftartoko", verifyToken, user.getToko);

//toko
router.post(
  "/addpostingan",
  verifyToken,
  upload.single("foto"),
  user.addpostingan
);
router.get("/manajemenProduk", verifyToken, user.myPostingan);

//manejemen produk
router.get("/manajemen", verifyToken, user.manajemen);
router.get("/manajemen/search", verifyToken, user.searchProduk);
router.put(
  "/manajemen/edit/:idpostingan",
  verifyToken,
  upload.single("foto"),
  user.editProduk
);
router.delete("/manajemen/delete/:idpostingan", verifyToken, user.deleteProduk);

//beli
router.post("/postingan/detailPostingan/beli", verifyToken, user.beli);

//dashboard
router.get("/dashboard/totalproduk", verifyToken, user.totalProduk);
router.get(
  "/dashboard/totalprodukterjual",
  verifyToken,
  user.totalProdukTerjual
);
router.get("/dashboard/totalpendapatan", verifyToken, user.totalPendapatan);
router.get("/dashboard/verifikasi", verifyToken, user.getVerifikasi);
router.put("/dashboard/verifikasi/:idverif", verifyToken, user.verifikasi);

//admin
router.get("/status", admin.status);

export default router;
