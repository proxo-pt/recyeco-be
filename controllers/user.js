const user = require("../models/user")
const bcrypt = require("bcrypt")
const postingan = require("../models/postingan")
const riwayat = require("../models/riwayat")
const tukarpoint = require("../models/tukarpoint")
const event = require("../models/event")
const keranjang = require("../models/keranjang")
const {Op, where} = require("sequelize")
const verifikasi = require("../models/verifikasi")
const tokos = require("../models/toko")
const { status } = require("./admin")
const { response } = require("express")
const toko = require("../models/toko")

module.exports = {

    search:async(req,res)=>{
        const {search} = req.body
        try {
            const produk = await postingan.findAll({
                where:{
                    judul:{
                        [Op.substring]:search
                    }
                },
                attributes:[
                    "foto",
                    "penjual",
                    "jenis",
                    "judul",
                    "harga",]
            })
            if(produk.length<1){
                return res.status(404).json({message:"postingan tidak ada"})
            }

            return res.status(200).json({postingan:produk})
        } catch (error) {
            return res.status(500).json({message:"eror"})
        }

    },

    logout:async(req,res)=>{
        const {id:iduser} = req.akun
        try {

            console.log("tesss",iduser)

            res.clearCookie("token");
            
            return res.status(200).json({message:"berhasil logout!"})
        } catch (error) {
            return res.status(500).json({error:error})
        }
    },

    myprofil:async(req,res)=>{
        const {id:iduser} = req.akun;
        try {
            const response = await user.findByPk(iduser,{
                attributes:[
                    "id",
                    "email",
                    "username",
                    "foto",
                    "ttl",
                    "jk"
                ]})
            
            return res.status(200).json({
                error:false,
                page:"myprofile",
                user:response
            })
        } catch (error) {
            return res.status(500).json({message:"error server"})
        }
    },

    getprofil:async(req,res)=>{
        const {id} = req.body;
        try {
            const response = await user.findByPk(id,{
                attributes:[
                    "foto",
                    "username",
                    "ttl",
                    "jk",
                    "email",
                    "point"]
            })
            if(!response){
                return res.status(404).json({message:"user not found"})
            }

            return res.status(200).json({message:"succes",profil:response})
        } catch (error) {
            return res.status(500).json({Message:"error server"})
        }
    },

    edituser:async(req,res)=>{
        const {id:iduser} = req.akun
        const {email,username,ttl,jk} = req.body
        const foto = req.file 

        try {
            const users = await user.findByPk(iduser)

            if(!users){
                return res.status(404).json({message:"user not found",user:users})
            }

            if(email){
                await users.update({email:email})
            }
            if(username){
                await users.update({username:username})
            }
            if(foto){
                await users.update({foto:foto.path})
            }
            if(ttl){
                await users.update({ttl:ttl})
            }
             if(jk){
                await users.update({jk:jk})
            }

            return res.status(200).json({message:"berhasil update!"})
        } catch (error) {
            return res.status(500).json({message:"server eror"})
        }
    },


    daftartoko:async(req,res)=>{
        const {id:iduser} = req.akun;
        const {toko,kontak,lokasi}=req.body

        // if(!toko||!kontak||!lokasi){
        //     return res.status(400).json({message:"kolom tidak boleh ada yang kosong!"})
        // }
        try {
            const users = await user.findByPk(iduser)
            if(!users){
                return res.status(404).json({message:"user not found"})
            }

            const toko = await tokos.findOne({
                where:{
                    pemilik:iduser
                }
            })

            if(toko){
                return res.status(400).json({message:"toko sudah ada!"})
            }

            const response = await tokos.create({
                pemilik:iduser,
                toko:toko,
                kontak:kontak,
                lokasi:lokasi
            })

            return res.status(201).json({message:"berhasil mendaftarkan toko",data_toko:response})

        } catch (error) {
            return res.status(500).json({message:"eror server"})
        }
    },

    addpostingan:async(req,res)=>{
        const {id:iduser} = req.akun;
        const{judul,jenis,deskripsi,berat,harga,lokasi}= req.body
        const foto = req.file

        if(!judul||!jenis||!deskripsi||!berat||!harga||!lokasi){
            return res.status(400).json({message:"*kolom harus di isi semua"})
        }
        try {
            const penjuals = await tokos.findOne({
                where:{
                    pemilik:iduser
                },
                include:[{
                    model:user,
                    foreignKey:"pemilik",
                    attributes:["id","username"]
                }],
                attributes:[
                    "id",
                    "pemilik",
                    "toko",
                    "kontak",
                    "lokasi"
                ]
            })


            if(!penjuals){
                return res.status(400).json({message:"tidak ada toko!"})
            }

            const response = await postingan.create({
                foto:foto.path,
                idpenjual:penjuals.id,
                penjual:penjuals.toko,
                judul:judul,
                jenis:jenis,
                deskripsi:deskripsi,
                berat:berat,
                harga:harga,
                lokasi:lokasi,
                status:"tersedia"
            })
            return res.status(201).json({message:"succes",postingan:response})
        } catch (error) {
            return res.status(500).json({message:"error server",error:error})
        }
    },

    postingan:async(req,res)=>{
        try {
            const response = await postingan.findAll({
                where:{
                    status:{
                        [Op.not]:"terjual"
                    }
                },
                attributes:[
                    "foto",
                    "penjual",
                    "jenis",
                    "judul",
                    "harga",]
            })

            return res.status(200).json({
                message:"succes",
                postingan:response
            })
        } catch (error) {
            return res.status(500).json({message:error})
        }
    },

    postinganByJenis:async(req,res)=>{
        const {jenis} = req.body;
        try {
            const response = await postingan.findAll({
                where:{
                    jenis:jenis
                },
                attributes:[
                    "foto",
                    "jenis",
                    "judul",
                    "harga",]
            })

            if(!response[0])
                return res.status(403).json({message:"tidak ada postingan"})
            

            return res.status(200).json({
                message:"succes",
                postingan:response
            })
        } catch (error) {
            return res.status(500).json({message:error})
        }
    },

    detailPostingan:async(req,res)=>{
        const {id} = req.body
        try {
            const response = await postingan.findOne({
                where:{
                    id:id
                },
                attributes:[
                    "foto",
                    "judul",
                    "jenis",
                    "berat",
                    "harga",
                    "deskripsi",
                    "lokasi",
                    "createdAt"]
            })

            if(!response){
                return res.status(403).json({message:"tidak ada postingan"})
            }

            return res.status(200).json({
                message:"succes",
                Postingan:response
            })
        } catch (error) {
            return res.status(500).json({message:error})
        }
    },

    myPostingan:async(req,res)=>{
        const {id:iduser} = req.akun

        try {
            const response = await postingan.findAll({
                where:{
                    idpenjual:iduser
                },
                attributes:[
                    "judul",
                    "jenis",
                    "berat",
                    "harga",
                    "status"
                ]
            })
            if(!response[0])
                return res.status(403).json({message:"postingan belum ada!"})

            return res.status(200).json({manajemen:response})
        } catch (error) {
            return res.status(500).json({message:error})
        }
    },

    addKeranjang:async(req,res)=>{
        const {id:iduser} = req.akun;
        const {id} = req.body;

        try {
            const produk = await postingan.findByPk(id)
            if(!produk){
                return res.status(403).json({message:"postingan tidak ada!"})
            }
            const keranjangs = await keranjang.findOne({
                where:{
                    iduser:iduser,
                    idpostingan:id
                }
            })

            if(keranjangs){
                return res.status(403).json({message:"postingan sudah di keranjang anda"})
            }


            const response = await keranjang.create({
                iduser:iduser,
                idpostingan:id
            })

            return res.status(200).json({message:"succes add keranjang"})
        } catch (error) {
            return res.status(500).json({message:"error"})
        }

  
    },

    keranjang:async(req,res)=>{
        const {id:iduser} = req.akun;
        try {
            const response = await keranjang.findAll({
                where:{
                    iduser:iduser
                },
                include:[{
                    model:postingan,
                    foreignKey:"idpostingan",
                    attributes:[
                        "foto",
                        "penjual",
                        "jenis",
                        "judul",
                        "harga",]
                }],
                attributes:[]
            })


            return res.status(200).json({
                message:"succes",
                keranjang:response
            })
        } catch (error) {
            return res.status(500).json({message:error})
        }
    },

    beli:async(req,res)=>{
        const {id:iduser} = req.akun
        const {idpostingan} = req.params

        try {
            const users = await toko.findOne({
                where:{
                    pemilik:iduser
                },
                include:[{
                    model:user,
                    foreignKey:"pemilik",
                }]
            })
            const response = await postingan.findByPk(idpostingan)
            if(!response){
                return res.status(403).json({message:"postingan tidak ada!"})
            }

            if(users.pemilki === response.idpenjual){
                return res.status(400).json({message:"nda bisa dong postingan anda sendiri"})
            }
            
            if(response.status==="terjual"){
                return res.status(400).json({message:"sudah terjual"})
            }

            await response.update({status:"menunggu"})

            const verif = await verifikasi.create({
                pembeli:users.user.username,
                idpostingan:idpostingan
            })

            return res.status(200).json({message:"succes,dan silahkan hubungi penjual"})
        } catch (error) {
            return res.status(500).json({message:"ERROR"})
        }
    },

//dashboard
    totalproduk:async(req,res)=>{
        const {id:iduser} = req.akun;
        try {
            const response = await postingan.findAll({
                include:[{
                    model:toko,
                    foreignKey:"pemilik",
                    where:{
                        pemilik:iduser
                    }
                }]
            })

            return res.status(200).json({total_produk : response.length})
        } catch (error) {
            return res.status(500).json({message:"eror"})
        }
    },

    totalprodukterjual:async(req,res)=>{
        const {id:iduser} = req.akun;
        try {
            const response = await postingan.findAll({
                where:{
                    status:"terjual"
                },
                include:[{
                    model:toko,
                    foreignKey:"pemilik",
                    where:{
                        pemilik:iduser
                    }
                }]
            })

            return res.status(200).json({total_produk : response.length})
        } catch (error) {
            return res.status(500).json({message:"eror",error:error})
        }
    },

    totalpendapatan:async(req,res)=>{
        const {id:iduser} = req.akun;

        try {
            const total = await postingan.sum("harga",{
                where:{
                    status:"terjual"
                },
                include:[{
                    model:toko,
                    foreignKey:"pemilik",
                    where:{
                        pemilik:iduser
                    }
                }]
            })

            
            return res.status(200).json({total:total})
        } catch (error) {
            return res.status(500)
        }
    },

    veri:async(req,res)=>{
        try {
            const response = await verifikasi.findAll({
                attributes:["id","pembeli"],
                include:[{
                    model:postingan,
                    foreignKey:"idpostingan",
                    attributes:[
                        "judul",
                        "berat",
                        "harga",
                        "status"
                    ]
                }]
            })

            return res.status(200).json({verifikasi:response})
        } catch (error) {
            return res.status(500)
        }

    },
    getverifikasi:async(req,res)=>{
        const {id:iduser} = req.akun;
        try {
            const verif = await verifikasi.findAll({
                attributes:["id","pembeli"],
                include:[{
                    model:postingan,
                    foreignKey:"idpostingan",
                    where:{
                        status:"menunggu"
                    },
                    include:[{
                        model:toko,
                        foreignKey:"idpenjual",
                        attributes:[],
                        where:{
                            pemilik:iduser
                        }
                    }],
                    attributes: [
                        "judul", 
                        "berat",
                         "harga", 
                         "status"],
                }]
            })

            return res.status(200).json({daftar_menunggu_verifikasi:verif})
        } catch (error) {
            return res.status(500).json({message:"eror server"})
        }
    },

    verifikasi: async (req, res) => {
        const {id:iduser} = req.akun
        const { idverif} = req.params;
        const { aksi } = req.body;
        try {
            const verif = await verifikasi.findByPk(idverif,{
            attributes: ["id","pembeli"],
            include: [{
                model: postingan,
                foreignKey: "idpostingan",
                where: {
                status: "menunggu"
            },
                include:[{
                    model:toko,
                    foreignKey:"pemilik",
                    where:{
                        pemilik:iduser
                    },
                    attributes:[]
                }],                    
                attributes: [
                    "judul",
                     "berat", 
                     "harga", 
                     "status"],
            }]
        })

      
        if (!verif) {
            return res.status(404).json({ message: "Tidak ada verifikasi!" })
            }
            
          if (aksi === "setuju") {
                try{
            await verif.postingan.update({ status: "terjual" });
            await verif.destroy()
            return res.status(200).json({ message: "Berhasil terjual!", verif: verif });
                }
                catch(error){
                return res.status(500).json({ message: "Terjadi kesalahan saat menerima verifikasi" ,error:error});
                }
          }
          if (aksi === "tolak") {
            try {
            await verif.destroy()
              return res.status(200).json({ message: "Berhasil menolak!" });
            } catch (error) {
              return res.status(500).json({ message: "Terjadi kesalahan saat menolak verifikasi" });
            }
          }
      
          return res.status(400).json({ message: "Aksi tidak valid" ,verif:verif})
        } catch (error) {
          return res.status(500).json({ message: "Error server" });
        }
      },

}