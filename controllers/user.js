const user = require("../models/user")
const bcrypt = require("bcrypt")
const postingan = require("../models/postingan")
const riwayat = require("../models/riwayat")
const tukarpoint = require("../models/tukarpoint")
const keranjang = require("../models/keranjang")
const {Op, where} = require("sequelize")
const verifikasi = require("../models/verifikasi")
const tokos = require("../models/toko")
const { status } = require("./admin")
const { response } = require("express")
const toko = require("../models/toko")

module.exports = {

    search:async(req,res)=>{
        const search = req.query.search
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
                    "birthdate",
                    "gender"
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
                    "birthdate",
                    "gender",
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
        const {email,username,gender,birthdate} = req.body
        const foto = req.file 

        try {
            const users = await user.findByPk(iduser)
            const akun = await user.findAll({
                where:{
                    email:email
                }
            })

            for( const item of akun){
                if(akun){
                    return res.status(400).json({message:"email sudah terdaftar!"})
                }
            }

            if(!users){
                return res.status(404).json({message:"user not found",user:users})
            }

            if(email){
                if(!email.includes('@')){
                    return res.status(400).json({message:"email harus dengan format @"})
                }
                await users.update({email:email})
            }
            if(username){
                await users.update({username:username})
            }
            if(foto){
                const fotoPath = `${req.protocol}://${req.get('host')}/${foto.path}`;
                const fotos = fotoPath.replace(/\\/g, '/')
                await users.update({ foto: fotos });
            }
            if(birthdate){
                await users.update({birthdate:birthdate})
            }
             if(gender){
                await users.update({gender:gender})
            }

            return res.status(200).json({message:"berhasil update!"})
        } catch (error) {
            return res.status(500).json({message:"server eror"})
        }
    },


    daftartoko:async(req,res)=>{
        const {id:iduser} = req.akun;
        const {toko,kontak,lokasi,link_map}=req.body

        if(!toko||!kontak||!lokasi||!link_map){
            return res.status(400).json({message:"kolom tidak boleh ada yang kosong!"})
        }
        try {
            const users = await user.findByPk(iduser)
            if(!users){
                return res.status(404).json({message:"user not found"})
            }

            const tokoo = await tokos.findOne({
                where:{
                    pemilik:iduser
                }
            })

            if(tokoo){
                return res.status(400).json({message:"toko sudah ada!"})
            }
            // const fotoPath = `${req.protocol}://${req.get('host')}/${foto.path}`;
            // const fotos = fotoPath.replace(/\\/g, '/')
            const response = await tokos.create({
                pemilik:iduser,
                toko:toko,
                kontak:kontak,
                lokasi:lokasi,
                link_map:link_map
            })

            return res.status(201).json({message:"berhasil mendaftarkan toko",data_toko:response})

        } catch (error) {
            return res.status(500).json({message:"eror server"})
        }
    },

    getTokoById: async (req, res) => {
        const { id: iduser } = req.akun;
    
        try {
          // Cari toko berdasarkan pemilik (ID pengguna)
          const toko = await tokos.findOne({
            where: {
              pemilik: iduser,
            },
            attributes: ["id", "toko", "kontak", "lokasi", "link_map"],
          });
    
          if (!toko) {
            return res.status(404).json({ message: "Toko tidak ditemukan" });
          }
    
          return res.status(200).json({ message: "Sukses", dataToko: toko });
        } catch (error) {
          return res.status(500).json({ message: "Error server", error: error });
        }
      },

    addpostingan:async(req,res)=>{
        const {id:iduser} = req.akun;
        const{judul,jenis,deskripsi,berat,harga}= req.body
        const foto = req.file

        if(!judul||!jenis||!deskripsi||!berat||!harga){
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
                    attributes:["id","username"],
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
                return res.status(400).json({message:"daftar toko terlebih dahulu!"})
            }

            const fotoPath = `${req.protocol}://${req.get('host')}/${foto.path}`;
            const fotos = fotoPath.replace(/\\/g, '/')
            const response = await postingan.create({
                foto:fotos,
                idpenjual:penjuals.id,
                penjual:penjuals.toko,
                judul:judul,
                jenis:jenis,
                deskripsi:deskripsi,
                berat:berat,
                harga:harga,
                lokasi:penjuals.lokasi,
                status:"tersedia"
            })
            return res.status(201).json({message:"succes",postingan:response})
        } catch (error) {
            return res.status(500).json({message:"error server",error:error})
        }
    },

    postingan:async(req,res)=>{
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 4; 
        const search = req.query.search;
        const jenis = req.query.jenis;
        const offset = (page - 1) * limit;

        try {
            let whereCondition = {
                status: {
                    [Op.not]: "terjual",
                },
            };
        
            if(jenis){
                whereCondition = {
                    ...whereCondition,
                    jenis:jenis
                }
            }
            if (search) {
                whereCondition = {
                ...whereCondition,
                    judul: {
                        [Op.substring]: search,
                    },
                };
            }
        
            const response = await postingan.findAndCountAll({
                where: whereCondition,
                attributes: [
                    "id",
                    "foto", 
                    "penjual", 
                    "jenis", 
                    "judul", 
                    "harga",
                    "status"],
                limit,
                offset,
            });
        
            if (!response) {
              return res.status(404).json({ message: "tidak ada postingan!" });
            }
        
            const { count, rows } = response;
        
            const totalPages = Math.ceil(count / limit); // Total halaman
            const hasNextPage = page < totalPages; // Apakah ada halaman berikutnya
        
            return res.status(200).json({
              message: "success",
              infoHalaman: {
                Halaman: page,
                total_Halaman: totalPages,
                halaman_berikut: hasNextPage,
              },
              postingan: rows,
            });
          } catch (error) {
            return res.status(500).json({ message: error });
          }
    },

    postinganByJenis:async(req,res)=>{
        const {jenis} = req.body;
        try {
            const page = parseInt(req.query.page) || 1; 
            const limit = parseInt(req.query.limit) || 2; 
            const offset = (page - 1) * limit;
            

        
            const response = await postingan.findAndCountAll({
                where: {
                    status: {
                        [Op.not]: "terjual",
                        },
                    jenis:jenis
                },
                attributes: [
                    "foto", 
                    "penjual",
                    "jenis", 
                    "judul", 
                    "harga"],

                    limit,
                    offset,
                });

            if(!response){
                return res.status(404).json({message:"tidak ada postingan!"})
            }

        
            const { count, rows } = response;
        
            const totalPages = Math.ceil(count / limit); // Total halaman
            const hasNextPage = page < totalPages; // Apakah ada halaman berikutnya
            
        
            return res.status(200).json({
              message: "success",
              infoHalaman: {
                Halaman: page,
                total_Halaman:totalPages,
                halaman_berikut:hasNextPage,
              },
              postingan: rows,

            });
          } catch (error) {
            return res.status(500).json({ message: error });
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
                    "status",
                    ["createdAt","tanggalPosting"],
                    ["updatedAt","tanggalTerjual"]
                    ],
                    include:[{
                        model:toko,
                        foreignKey:"pemilik",
                        attributes:["lokasi","link_map"]
                    }]
            })

            if(!response){
                return res.status(403).json({message:"tidak ada postingan"})
            }

            const postDate = response.get('tanggalPosting').toLocaleDateString('id-ID',{
                day:'2-digit',
                month: 'long',
                year: 'numeric'
            })

            
            let soldDate = null;
            if (response.get('status') === "terjual") {
              soldDate = response.get('tanggalTerjual').toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              });
            }

            response.setDataValue('tanggalPosting', postDate);
            response.setDataValue('tanggalTerjual', soldDate);
            

            return res.status(200).json({
                message:"succes",
                Postingan:response,
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
            const toko = await tokos.findAll({
                where:{
                    pemilik:iduser
                }
            })
            if(toko){
                return res.status(400).json({message:"tidak bisa menambah postingan sendiri ke keranjang"})
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

            const pembeli = await user.findByPk(iduser)
            const users = await toko.findOne({
                include:[{
                    model:user,
                    foreignKey:"pemilik",
                    attributes:[]
                }]
            })
            const response = await postingan.findByPk(idpostingan,{
                include:[{
                    model:toko,
                    foreignKey:"idpenjual"
                }]
            })
            if(!response){
                return res.status(404).json({message:"postingan tidak ada!"})
            }

            if(iduser === response.toko.pemilik){
                return res.status(400).json({message:"nda bisa dong postingan anda sendiri"})
            }
            
            if(response.status==="terjual"){
                return res.status(400).json({message:"sudah terjual"})
            }

            await response.update({status:"menunggu"})

            const verif = await verifikasi.create({
                pembeli:pembeli.username,
                idpostingan:idpostingan
            })

            return res.status(200).json({message:"succes,dan silahkan hubungi penjual",users:users,response:response.toko.pemilik})
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

            include:[{
                model:postingan,
                foreignKey:"idpenjual",
                include:[{
                    model:toko,
                    foreignKey:"pemilik"
                }]
            }]
        })

        if(!verif){
            return res.status(404).json({message:"verifikasi not found"})
        }

        if(verif.postingan.status === "terjual"){
            return res.status(400).json({message:"postingan sudah terjual"})
        }

        if(aksi === "setuju"){
            await verif.postingan.update({status:"terjual"})
            await verifikasi.destroy({
                where:{
                    idpostingan:verif.idpostingan
                }
            })
            return res.status(200).json({message:"berhasil terjual"})
        }

        if(aksi === "batalkan"){
            await verif.destroy()
            return res.status(200).json({message:"verifikasi di batalkan"})
        }

        if(aksi !== "setuju" || aksi !== "batalkan"){
            return res.status(400).json({message:"salah value"})
        }

        } catch (error) {
          return res.status(500).json({ message: "Error server" });
        }
    },

//manajemen produk    
    manajemen:async(req,res)=>{
        const {id:iduser} = req.akun
        try {
            const produk = await postingan.findAll({
                attributes:[
                    "judul",
                    "jenis",
                    "berat",
                    "harga",
                    "status"
                ],
                include:[{
                    model:toko,
                    foreignKey:"pemilik",
                    where:{
                        pemilik:iduser
                    },
                    attributes:[]
                }]
            })
            console.log(produk)
            const tersedia = produk.filter((p) => p.status === "tersedia")
            const menunggu = produk.filter((p) => p.status === "menunggu")
            const terjual = produk.filter((p) => p.status === "terjual")
            
            
            return res.status(200).json({
            message:"succes",
            semua:produk.length,
            tersedia:tersedia.length,
            menunggu:menunggu.length,
            terjual:terjual.length,
            produk:produk})

        } catch (error) {
            return res.status(500).json({message:"eror server"})
        }
    },
    searchproduk:async(req,res)=>{
        const {id:iduser} = req.akun
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
                    "harga",],
                include:[{
                    model:toko,
                    foreignKey:"pemilik",
                    where:{
                        pemilik:iduser
                    },attributes:[]
                }]
            })

            if(produk.length<1){
                return res.status(404).json({message:"postingan tidak ada"})
            }

            return res.status(200).json({postingan:produk})
        } catch (error) {
            return res.status(500).json({message:"eror"})
        }

    },
    editproduk:async(req,res)=>{
        const {id:iduser} = req.akun
        const {idpostingan} = req.params
        const{judul,jenis,deskripsi,berat,harga,}= req.body
        const foto = req.file
        
        try {
            const produk = await postingan.findByPk(idpostingan,{
                include:[{
                    model:toko,
                    foreignKey:"pemilik",
                    where:{
                        pemilik:iduser
                    }
                }]
            })

            if(!produk){
                return res.status(400).json({message:"postingan tidak ada!"})
            }

            if(judul){
                await produk.update({judul:judul})
            }
            if(jenis){
                await produk.update({jenis:jenis})
            }
            if(berat){
                await produk.update({berat:berat})
            }
            if(harga){
                await produk.update({harga:harga})
            }
            if(deskripsi){
                await produk.update({deskripsi:deskripsi})
            }
            if(foto){
                const fotoPath = `${req.protocol}://${req.get('host')}/${foto.path}`;
                const fotos = fotoPath.replace(/\\/g, '/')
                await produk.update({ foto: fotos });
            }


            return res.status(200).json({message:"postingan berhasil di update!",data:produk})


        } catch (error) {
            return res.status(500).json({message:"error internal server"})    
        }
    },
    deleteproduk:async(req,res)=>{
        const {id:iduser}= req.akun
        const {idpostingan} = req.params

        try {
            const verif = await verifikasi.findAll({
                where:{
                    idpostingan:idpostingan
                }
            })
            if(verif.length === 0){
                return req.json({message:"tidak ada verif"})
            }
            for (const item of verif) {
                await item.destroy();
              }

            const produk = await postingan.findByPk(idpostingan,{
                include:[{
                    model:toko,
                    foreignKey:"pemilik",
                    where:{
                        pemilik:iduser
                    }
                }]
            })

            if(!produk){
                return res.status(400).json({message:"postingan tidak ada!"})
            }
            await produk.destroy()
            return res.status(200).json({message:"berhasil terhapus!"})
        } catch (error) {
            return res.status(500).json({message:"internal server error",error})
        }
    },

}