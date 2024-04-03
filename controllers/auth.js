const user = require("../models/user")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")

module.exports={

    register:async(req,res)=>{
        const {username,email,password,ttl,jk}=req.body;
        const foto = req.file;

        if(!username || !password || !email || !foto || !ttl || !jk){
            return res.json({message:"username,email,password,foto,tempat tanggal lahir,jenis kelamin tidak boleh kosong!"})
        }       
        if(password.length < 8){
            return res.json({message:"minimal 8 karakter"})
        }
        if(!email.includes("@")){
            return res.json({message:"harus dengan format @"})
        }
        try {
            const cekuser = await user.findAll()
            if(cekuser.email === email){
                return res.json({message:"email sudah terdaftar"})
            }
            
            const users = await user.findOne({where:{email:email}})
            if(users){
                console.log("email sudah terdaftar")
                return res.status(400).json({message:"email sudah terdaftar"})
            }
            
            const hashPassword = await bcrypt.hash(password,10)
            const akun= await user.create({
                username:username,
                email:email,
                password:hashPassword,
                foto:foto.path,
                ttl:ttl,
                jk:jk
            })
            return res.status(200).json({message:"registrasi berhasil",data:akun})
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)            
        }
    },

    login:async(req,res)=>{
        //masih salah2 login
        const {email,password} = req.body
        if(!email && !password){
            return res.json({message:"email atau password tidak boleh kosong!"})
        }       
        if(!password){
            return res.json({message:"password tidak boleh kosong!"})
        }
        if(!email){
            return res.json({message:"email tidak boleh kosong!"})
        }
        if(!email.includes("@")){
            return res.json({message:"harus dengan format @"})
        }

        try {
            const usernames = await user.findOne({
                where:{
                    email:email
                }})
            if(!usernames){
                return res.json({message:"email tidak terdaftar"})
            }
            const passwords = await bcrypt.compare(password, usernames.password)
            if(!passwords){
                return res.json({message:"password salah!"})
    }
            //create jwt
            const token=jwt.sign({
                id:usernames.id,
                username:usernames.username
            },
            "qwertyuiop",
            {expiresIn:'1d'})

            await usernames.update({token:token}) 
            
            res.cookie("token",token,{
                httpOnly:true,
                maxAge: 24 * 60 * 60 * 1000
            })
            
            return res.status(200).json({message:"login berhasil!",id:usernames.id,token:token})
            
        } catch (error) {
            return res.json({message:"error",error})
        }
        
    },

    sendemail:async(req, res) => {

        const { email } = req.body;
        try {
            const users = await user.findOne({
                where:{
                    email:email
                }
            })

            if(!users){
                return res.status(403).json({message:"email not found"})
            }
            const emailBody = `
                <h1>Reset Password</h1>
                <p>Halo,kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Untuk melanjutkan proses pengaturan ulang kata sandi,<br>

                Klik tautan verifikasi di bawah ini:</p>
                <a href="http://localhost:1000/" target="_blank" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px; text-align:center;">Verifikasi Akun</a>
                
                <p>Setelah tautan verifikasi berhasil diakses, Anda akan diarahkan ke halaman pengaturan ulang kata sandi.<br>
                
                Jika Anda tidak melakukan permintaan ini, Anda dapat mengabaikan email ini. Akun Anda akan tetap aman.<br>
                
                Terima kasih,<br>
                Tim Recyeco</p>
                
                `;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: 'recyecoteam@gmail.com',
                pass: 'mhwjspzzyrmffwpi'
                }
            });
            const sendmail = transporter.sendMail({
                from:"recyecoteam@gmail.com",
                to:email,
                subject:"forget-password",
                html:emailBody,
                text:"verifikasi akun"
            })
            if(!sendmail){
                return res.status(403).json({message:"gagal terikirim "})
            }
            
            return res.status(200).json({message:"berhasil terkirim"})
        } catch (error) {
            return res.status(404).json({error:error})
        }
 
    },

    resetpassword:async(req,res)=>{
        const {newpassword,confirmpassword} = req.body
        const {iduser} = req.params

        if(newpassword.length < 8){
            return res.json({message:"minimal 8 karakter"})
        }
        if(newpassword !== confirmpassword ){
            return res.json({message:"password dan confirm password beda!"})
        }

        try {
            const users = await user.findByPk(iduser)
            const hashPassword = await bcrypt.hash(newpassword,10)
            users.password = hashPassword
            await users.save()

            return res.json({message:"password baru berhasil di buat!"})
        } catch (error) {
            return res.json({message:"error server"})
        }

    }

}