const user = require("../models/user")
const bcrypt = require("bcrypt")
const postingan = require("../models/postingan")
const riwayat = require("../models/riwayat")
const tukarpoint = require("../models/tukarpoint")
const event = require("../models/event")
const keranjang = require("../models/keranjang")
const {Op, where} = require("sequelize")

module.exports = {

    logout:async(req,res)=>{
        const {iduser} = req.params
        try {
            const token = await user.findByPk(iduser)
            token.token = null
            await token.save()

            res.clearCookie("token")
            
            return res.status(200).json({message:"berhasil logout!"})
        } catch (error) {
            return res.status(400).json({error:error})
        }
    },

    myprofil:async(req,res)=>{
        const {iduser} = req.params;
        try {
            const response = await user.findByPk(iduser,{
                attributes:[
                    "email",
                    "username",
                    "foto",
                    "point",
                    "ttl",
                    "jk"
                ]})
            
            return res.status(200).json({error:false,page:"myprofile",user:response})
        } catch (error) {
            return res.status(400).json({message:"error server"})
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
                return res.status(403).json({message:"user not found"})
            }

            return res.json({message:"succes",profil:response})
        } catch (error) {
            return res.json({Message:"error server"})
        }
    },

    editusername:async(req,res)=>{
        const {username} = req.body;
        const {iduser} = req.params
        try {
            const users = await user.findByPk(iduser)
            console.log(users)
            if(!users)
                return res.json({message:"user not found"})

            await users.update({username:username})

            return res.status(200).json({message:"update username succes"})
        } catch (error) {
            return res.json({message:error})
        }
    },
    editemail:async(req,res)=>{
        const {email} = req.body;
        const {iduser} = req.params

        if(!email.includes("@")){
            return res.json({message:"harus dengan format @"})
        }
        try {
            const users = await user.findByPk(iduser)
            if(!users)
                return res.json({message:"user not found"})

            const cekusers = await user.findAll()

            if(users.email === cekusers.email){
                return res.json({message:"email sudah terdaftar"})
            }

            await users.update({email:email})

            return res.status(200).json({message:"update email succes"})
        } catch (error) {
            return res.json({message:error})
        }
    },

    addttl:async(req,res)=>{
        const {iduser} = req.params;
        const {ttl} = req.body;

        try {
            const users = await user.findByPk(iduser)

            await users.update({
                ttl:ttl
            })

            return res.json({message:"succes add tempat,tanggal lahir!"})
        } catch (error) {
            return res.json({error})
        }
    },

    addjk:async(req,res)=>{
        const {iduser} = req.params;
        const {jk} = req.body;

        try {
            const users = await user.findByPk(iduser)

            await users.update({
                jk:jk
            })

            return res.json({message:"succes add tempat,tanggal lahir!"})
        } catch (error) {
            return res.json({error})
        }
    },

    addfoto:async(req,res)=>{
        const foto = req.file;
        const {iduser} = req.params
        
        try {
            const users = await user.findByPk(iduser)
            if(!users)
                return res.json({message:"user not found"})


            await users.update({foto:foto.path})

            return res.status(200).json({message:"update foto succes"})
        } catch (error) {
            return res.json({message:error})
        }
    },

    addpostingan:async(req,res)=>{
        const {iduser} = req.params;
        const{judul,jenis,deskripsi,berat,harga,kontak,lokasi,latitude,longitude}= req.body
        const foto = req.file

        if(!judul||!jenis||!deskripsi||!berat||!harga||!kontak||!lokasi||!latitude||!longitude){
            return res.json({message:"*kolom harus di isi semua"})
        }
        try {
            const penjual = await user.findByPk(iduser)
            const response = await postingan.create({
                foto:foto.path,
                idpenjual:penjual.id,
                penjual:penjual.username,
                judul:judul,
                jenis:jenis,
                deskripsi:deskripsi,
                berat:berat,
                harga:harga,
                kontak:kontak,
                lokasi:lokasi,
                latitude:latitude,
                longitude:longitude,
                status:"tersedia"
            })
            return res.status(200).json({message:"succes",postingan:response})
        } catch (error) {
            return res.status(400).json({message:"error server",error:error})
        }
    },

    postingan:async(req,res)=>{
        try {
            const response = await postingan.findAll({
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
            return res.json({message:error})
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
                return res.json({message:"tidak ada postingan"})
            

            return res.status(200).json({
                message:"succes",
                postingan:response
            })
        } catch (error) {
            return res.json({message:error})
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
                return res.json({message:"tidak ada postingan"})
            }

            return res.status(200).json({
                message:"succes",
                Postingan:response
            })
        } catch (error) {
            return res.json({message:error})
        }
    },

    myPostingan:async(req,res)=>{
        const {iduser} = req.params

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
                return res.json({message:"postingan belum ada!"})

            return res.json({manajemen:response})
        } catch (error) {
            return res.json({message:error})
        }
    },

    addKeranjang:async(req,res)=>{
        const {iduser} = req.params;
        const {id} = req.body;

        try {
            const produk = await postingan.findByPk(id)
            if(!produk){
                return res.status(404).json({message:"postingan tidak ada!"})
            }
            const keranjangs = await keranjang.findOne({
                where:{
                    iduser:iduser,
                    idpostingan:id
                }
            })

            if(keranjangs){
                return res.json({message:"postingan sudah di keranjang anda"})
            }


            const response = await keranjang.create({
                iduser:iduser,
                idpostingan:id
            })

            return res.json({message:"succes add keranjang"})
        } catch (error) {
            return res.json({message:"error"})
        }

  
    },

    keranjang:async(req,res)=>{
        const {iduser} = req.params;
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


            return res.json({
                message:"succes",
                keranjang:response
            })
        } catch (error) {
            return res.json({message:error})
        }
    },

    beli:async(req,res)=>{
        const {iduser,idpostingan} = req.params

        try {
            const users = await user.findByPk(iduser)
            const response = await postingan.findByPk(idpostingan)

            if(!response){
                return res.json({message:"postingan tidak ada!"})
            }

            if(users.id === response.idpenjual){
                return res.json({message:"nda bisa dong postingan anda sendiri"})
            }
            
            if(response.status==="terjual"){
                return res.json({message:"sudah terjual"})
            }
        
            await response.update({status:"menunggu"})

            return res.json({message:"succes,dan silahkan hubungi penjual"})
        } catch (error) {
            return res.json({message:"ERROR"})
        }
    },

//dashboard
    totalproduk:async(req,res)=>{
        const {iduser} = req.params;
        try {
            const response = await postingan.findAll({
                where:{
                    idpenjual:iduser
                }
            })

            return res.json({total_produk : response.length})
        } catch (error) {
            return res.json({message:"eror"})
        }
    },

    totalprodukterjual:async(req,res)=>{
        const {iduser} = req.params;
        try {
            const response = await postingan.findAll({
                where:{
                    idpenjual:iduser,
                    status:"terjual"
                }
            })

            return res.json({total_produk : response.length})
        } catch (error) {
            return res.json({message:"eror"})
        }
    },

    totalpendapatan:async(req,res)=>{
        const {iduser} = req.params;

        try {
            const total = await postingan.sum("harga",{
                where:{
                    idpenjual:iduser,
                    status:"terjual"
                }
            })

            
            return res.json({total:total})
        } catch (error) {
            return res.status(404)
        }
    },

}