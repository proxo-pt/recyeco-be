import user from "../models/user.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export default {
  async register(req, res) {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        message:
          "username,email,password,foto,tempat tanggal lahir,jenis kelamin tidak boleh kosong!",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "password minimal 8 karakter" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ message: "harus dengan format @" });
    }
    try {
      const cekuser = await user.findAll();
      if (cekuser.email === email) {
        return res.json({ message: "email sudah terdaftar" });
      }

      const users = await user.findOne({ where: { email: email } });
      if (users) {
        console.log("email sudah terdaftar");
        return res.status(400).json({ message: "email sudah terdaftar" });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const akun = await user.create({
        username: username,
        email: email,
        password: hashPassword,
      });
      return res
        .status(201)
        .json({ message: "registrasi berhasil", data: akun });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    if (!email && !password) {
      return res
        .status(400)
        .json({ message: "email atau password tidak boleh kosong!" });
    }
    if (!password) {
      return res.status(400).json({ message: "password tidak boleh kosong!" });
    }
    if (!email) {
      return res.status(400).json({ message: "email tidak boleh kosong!" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ message: "harus dengan format @" });
    }

    try {
      const usernames = await user.findOne({
        where: {
          email: email,
        },
      });
      if (!usernames) {
        return res.status(404).json({ message: "email tidak terdaftar" });
      }
      const passwords = await bcrypt.compare(password, usernames.password);
      if (!passwords) {
        return res.status(404).json({ message: "password salah!" });
      }
      //create jwt
      const token = jwt.sign(
        {
          id: usernames.id,
        },
        "qwertyuiop",
        { expiresIn: "1d" }
      );

      await usernames.update({ token: token });

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .json({ message: "login berhasil!", id: usernames.id, token: token });
    } catch (error) {
      return res.status(500).json({ message: "error", error });
    }
  },

  async sendEmail(req, res) {
    const { email } = req.body;
    try {
      const users = await user.findOne({
        where: {
          email: email,
        },
      });
      const token = jwt.sign(
        {
          id: users.id,
        },
        "qwertyuiop",
        { expiresIn: "1d" }
      );
      if (!users) {
        return res.status(403).json({ message: "email not found" });
      }
      const emailBody = `
                <h1>Reset Password</h1>
                <p>Halo,kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Untuk melanjutkan proses pengaturan ulang kata sandi,<br>

                Klik tautan verifikasi di bawah ini:</p>
                <a href="http://localhost:3000/forget-newpass?param=${token}" target="_blank" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px; text-align:center;">Verifikasi Akun</a>
                
                <p>Setelah tautan verifikasi berhasil diakses, Anda akan diarahkan ke halaman pengaturan ulang kata sandi.<br>
                
                Jika Anda tidak melakukan permintaan ini, Anda dapat mengabaikan email ini. Akun Anda akan tetap aman.<br>
                
                Terima kasih,<br>
                Tim Recyeco</p>
                
                `;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "recyecoteam@gmail.com",
          pass: "mhwjspzzyrmffwpi",
        },
      });
      const sendmail = transporter.sendMail({
        from: "recyecoteam@gmail.com",
        to: email,
        subject: "forget-password",
        html: emailBody,
        text: "verifikasi akun",
      });
      if (!sendmail) {
        return res.status(403).json({ message: "gagal terikirim " });
      }

      return res.status(200).json({ message: "berhasil terkirim" });
    } catch (error) {
      return res.status(404).json({ error: error });
    }
  },

  async resetPassword (req, res) {
    const { newpassword, confirmpassword } = req.body;
    const { id: iduser } = req.akun;

    if (newpassword.length < 8) {
      return res.status(400).json({ message: "minimal 8 karakter" });
    }
    if (newpassword !== confirmpassword) {
      return res
        .status(400)
        .json({ message: "password dan confirm password beda!" });
    }

    try {
      const users = await user.findByPk(iduser);
      const hashPassword = await bcrypt.hash(newpassword, 10);
      users.password = hashPassword;
      await users.save();

      return res
        .status(200)
        .json({ message: "password baru berhasil di buat!" });
    } catch (error) {
      return res.status(500).json({ message: "error server" });
    }
  },
};
