import user from "../models/user.js";
import postingan from "../models/postingan.js";
import { Op } from "sequelize";
import verifikasi from "../models/verifikasi.js";
import toko from "../models/toko.js";
import tokos from "../models/toko.js";
import sharp from "sharp";

export default {
  async search(req, res) {
    const search = req.query.search;
    try {
      const produk = await postingan.findAll({
        where: {
          judul: {
            [Op.substring]: search,
          },
        },
        attributes: ["foto", "penjual", "jenis", "judul", "harga"],
      });
      if (produk.length < 1) {
        return res.status(404).json({ message: "postingan tidak ada" });
      }

      return res.status(200).json({ postingan: produk });
    } catch (error) {
      return res.status(500).json({ message: "eror" });
    }
  },

  async logout(req, res) {
    const { id: iduser } = req.akun;
    try {
      console.log("tesss", iduser);

      res.clearCookie("token");

      return res.status(200).json({ message: "berhasil logout!" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  },

  async getProfil(req, res) {
    const { id: iduser } = req.akun;
    try {
      const response = await user.findByPk(iduser, {
        attributes: ["id", "email", "username", "foto", "birthdate", "gender"],
      });
      return res.status(200).json({
        error: false,
        page: "myprofile",
        user: response,
      });
    } catch (error) {
      return res.status(500).json({ message: "error server" });
    }
  },

  async editUser(req, res) {
    const { id: iduser } = req.akun;
    const { email, username, gender, birthdate } = req.body;
    const foto = req.file;

    try {
      const users = await user.findByPk(iduser);
      const akun = await user.findAll({
        where: {
          email: email,
        },
      });

      for (const item of akun) {
        if (akun) {
          return res.status(400).json({ message: "email sudah terdaftar!" });
        }
      }

      if (!users) {
        return res.status(404).json({ message: "user not found", user: users });
      }

      if (email) {
        if (!email.includes("@")) {
          return res
            .status(400)
            .json({ message: "email harus dengan format @" });
        }
        await users.update({ email: email });
      }
      if (username) {
        await users.update({ username: username });
      }
      if (foto) {
        const compressedImageBuffer = await sharp(foto.buffer)
          .resize({ width: 400 })
          .toBuffer();

        const base64CompressedImage = compressedImageBuffer.toString("base64");
        const fotos = `data:${foto.mimetype};base64,` + base64CompressedImage;
        await users.update({ foto: fotos });
      }
      if (birthdate) {
        await users.update({ birthdate: birthdate });
      }
      if (gender) {
        await users.update({ gender: gender });
      }

      return res.status(200).json({ message: "berhasil update!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "server eror" });
    }
  },

  async daftarToko(req, res) {
    const { id: iduser } = req.akun;
    const { toko, kontak, lokasi, link_map } = req.body;

    if (!toko || !kontak || !lokasi || !link_map) {
      return res
        .status(400)
        .json({ message: "kolom tidak boleh ada yang kosong!" });
    }
    try {
      const users = await user.findByPk(iduser);
      if (!users) {
        return res.status(404).json({ message: "user not found" });
      }

      const tokoo = await tokos.findOne({
        where: {
          pemilik: iduser,
        },
      });

      if (tokoo) {
        return res.status(400).json({ message: "toko sudah ada!" });
      }
      const response = await tokos.create({
        pemilik: iduser,
        toko: toko,
        kontak: kontak,
        lokasi: lokasi,
        link_map: link_map,
      });

      return res
        .status(201)
        .json({ message: "berhasil mendaftarkan toko", data_toko: response });
    } catch (error) {
      return res.status(500).json({ message: "eror server" });
    }
  },

  async getToko(req, res) {
    const { id: iduser } = req.akun;

    try {
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

  async addpostingan(req, res) {
    const { id: iduser } = req.akun;
    const { judul, jenis, deskripsi, berat, harga } = req.body;
    const foto = req.file;

    if (!judul || !jenis || !deskripsi || !berat || !harga) {
      return res.status(400).json({ message: "*kolom harus di isi semua" });
    }
    try {
      const penjuals = await tokos.findOne({
        where: {
          pemilik: iduser,
        },
        include: [
          {
            model: user,
            foreignKey: "pemilik",
            attributes: ["id", "username"],
          },
        ],
        attributes: ["id", "pemilik", "toko", "kontak", "lokasi"],
      });

      if (!penjuals) {
        return res
          .status(400)
          .json({ message: "daftar toko terlebih dahulu!" });
      }

      const compressedImageBuffer = await sharp(foto.buffer)
        .resize(1280, 720)
        .toBuffer();

      const base64CompressedImage = compressedImageBuffer.toString("base64");
      const fotos = `data:${foto.mimetype};base64,` + base64CompressedImage;
      const response = await postingan.create({
        foto: fotos,
        idpenjual: penjuals.id,
        penjual: penjuals.toko,
        judul: judul,
        jenis: jenis,
        deskripsi: deskripsi,
        berat: berat,
        harga: harga,
        lokasi: penjuals.lokasi,
        status: "tersedia",
      });
      return res.status(201).json({ message: "succes", postingan: response });
    } catch (error) {
      return res.status(500).json({ message: "error server", error: error });
    }
  },

  async postingan(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search;
    const jenis = req.query.jenis;
    const offset = (page - 1) * limit;

    try {
      let whereCondition = {
        status: {
          [Op.not]: "terjual",
        },
      };

      if (jenis) {
        whereCondition = {
          ...whereCondition,
          jenis: jenis,
        };
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
          "berat",
          "harga",
          "status",
        ],
        limit,
        offset,
      });

      if (!response) {
        return res.status(404).json({ message: "tidak ada postingan!" });
      }

      const { count, rows } = response;

      const totalPages = Math.ceil(count / limit);
      const hasNextPage = page < totalPages;

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

  async postinganByJenis(req, res) {
    const { jenis } = req.body;
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 15;
      const offset = (page - 1) * limit;

      const response = await postingan.findAndCountAll({
        where: {
          status: {
            [Op.not]: "terjual",
          },
          jenis: jenis,
        },
        attributes: ["foto", "penjual", "jenis", "judul", "harga"],

        limit,
        offset,
      });

      if (!response) {
        return res.status(404).json({ message: "tidak ada postingan!" });
      }

      const { count, rows } = response;

      const totalPages = Math.ceil(count / limit);
      const hasNextPage = page < totalPages;

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

  async detailPostingan(req, res) {
    const id = req.query.id;
    try {
      const response = await postingan.findOne({
        where: {
          id: id,
        },
        attributes: [
          "id",
          "foto",
          "judul",
          "jenis",
          "berat",
          "harga",
          "deskripsi",
          "status",
          ["createdAt", "tanggalPosting"],
          ["updatedAt", "tanggalTerjual"],
        ],
        include: [
          {
            model: toko,
            foreignKey: "pemilik",
            attributes: ["toko", "lokasi", "link_map", "kontak"],
          },
        ],
      });

      if (!response) {
        return res.status(403).json({ message: "tidak ada postingan" });
      }

      const postDate = response
        .get("tanggalPosting")
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

      let soldDate = null;
      if (response.get("status") === "terjual") {
        soldDate = response.get("tanggalTerjual").toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      }

      response.setDataValue("tanggalPosting", postDate);
      response.setDataValue("tanggalTerjual", soldDate);

      return res.status(200).json({
        message: "succes",
        postingan: response,
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  async myPostingan(req, res) {
    const { id: iduser } = req.akun;

    try {
      const response = await postingan.findAll({
        where: {
          idpenjual: iduser,
        },
        attributes: ["judul", "jenis", "berat", "harga", "status"],
      });
      if (!response[0])
        return res.status(403).json({ message: "postingan belum ada!" });

      return res.status(200).json({ manajemen: response });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  async beli(req, res) {
    const { id: iduser } = req.akun;
    const idpostingan = req.query.idpostingan;

    try {
      const pembeli = await user.findByPk(iduser);
      const users = await tokos.findOne({
        include: [
          {
            model: user,
            foreignKey: "pemilik",
            attributes: [],
          },
        ],
      });
      const response = await postingan.findByPk(idpostingan, {
        include: [
          {
            model: toko,
            foreignKey: "idpenjual",
          },
        ],
      });
      if (!response) {
        return res.status(404).json({ message: "postingan tidak ada!" });
      }

      if (iduser === response.toko.pemilik) {
        return res
          .status(400)
          .json({ message: "nda bisa dong postingan anda sendiri" });
      }

      if (response.status === "terjual") {
        return res.status(400).json({ message: "sudah terjual" });
      }

      if (response.status === "menunggu") {
        return res
          .status(400)
          .json({ message: "sedang transaksi oleh pembeli lain" });
      }

      await response.update({ status: "menunggu" });

      const verif = await verifikasi.create({
        pembeli: pembeli.username,
        idpostingan: idpostingan,
      });

      return res.status(200).json({
        message: "succes,dan silahkan hubungi penjual",
        users: users,
        response: response.toko.pemilik,
      });
    } catch (error) {
      return res.status(500).json({ message: "ERROR" });
    }
  },

  async totalProduk(req, res) {
    const { id: iduser } = req.akun;
    try {
      const response = await postingan.findAll({
        include: [
          {
            model: toko,
            foreignKey: "pemilik",
            where: {
              pemilik: iduser,
            },
          },
        ],
      });

      return res.status(200).json({ total_produk: response.length });
    } catch (error) {
      return res.status(500).json({ message: "eror" });
    }
  },

  async totalProdukTerjual(req, res) {
    const { id: iduser } = req.akun;
    try {
      const response = await postingan.findAll({
        where: {
          status: "terjual",
        },
        include: [
          {
            model: toko,
            foreignKey: "pemilik",
            where: {
              pemilik: iduser,
            },
          },
        ],
      });

      return res.status(200).json({ total_produk: response.length });
    } catch (error) {
      return res.status(500).json({ message: "eror", error: error });
    }
  },

  async totalPendapatan(req, res) {
    const { id: iduser } = req.akun;

    try {
      const total = await postingan.sum("harga", {
        where: {
          status: "terjual",
        },
        include: [
          {
            model: toko,
            foreignKey: "pemilik",
            where: {
              pemilik: iduser,
            },
          },
        ],
      });

      return res.status(200).json({ total: total });
    } catch (error) {
      return res.status(500);
    }
  },

  async getVerifikasi(req, res) {
    const { id: iduser } = req.akun;
    try {
      const verif = await verifikasi.findAll({
        attributes: ["id", "pembeli"],
        include: [
          {
            model: postingan,
            foreignKey: "idpostingan",
            where: {
              status: "menunggu",
            },
            include: [
              {
                model: toko,
                foreignKey: "idpenjual",
                attributes: [],
                where: {
                  pemilik: iduser,
                },
              },
            ],
            attributes: ["judul", "berat", "harga", "status"],
          },
        ],
      });

      return res.status(200).json({ daftar_menunggu_verifikasi: verif });
    } catch (error) {
      return res.status(500).json({ message: "eror server" });
    }
  },

  async verifikasi(req, res) {
    const { id: iduser } = req.akun;
    const { idverif } = req.params;
    const { aksi } = req.body;
    try {
      const verif = await verifikasi.findByPk(idverif, {
        include: [
          {
            model: postingan,
            foreignKey: "idpenjual",
            include: [
              {
                model: toko,
                foreignKey: "pemilik",
              },
            ],
          },
        ],
      });

      if (!verif) {
        return res.status(404).json({ message: "verifikasi not found" });
      }

      if (verif.postingan.status === "terjual") {
        return res.status(400).json({ message: "postingan sudah terjual" });
      }

      if (aksi === "Setujui") {
        await verif.postingan.update({ status: "terjual" });
        await verifikasi.destroy({
          where: {
            idpostingan: verif.idpostingan,
          },
        });
        return res.status(200).json({ message: "berhasil terjual" });
      }

      if (aksi === "Batalkan") {
        for (const item of verif) {
          await item.destroy();
        }
        return res.status(200).json({ message: "verifikasi di batalkan" });
      }

      if (aksi !== "setuju" || aksi !== "batalkan") {
        return res.status(400).json({ message: "salah value" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error server" });
    }
  },

  async manajemen(req, res) {
    const { id: iduser } = req.akun;
    const verif = await verifikasi.findAll();
    console.log("tesss", verif);
    try {
      const produk = await postingan.findAll({
        attributes: ["id", "judul", "jenis", "berat", "harga", "status"],
        include: [
          {
            model: toko,
            foreignKey: "pemilik",
            where: {
              pemilik: iduser,
            },
            attributes: [],
          },
        ],
      });

      const verifProduk = produk.map((item) => {
        const matchedVerif = verif.find(
          (v) => v.dataValues.idpostingan === item.dataValues.id
        );
        if (matchedVerif) {
          return {
            ...item.dataValues,
            id_verify: matchedVerif.id,
          };
        }
        return { ...item.dataValues, id_verify: null };
      });

      const tersedia = produk.filter((p) => p.status === "tersedia");
      const menunggu = produk.filter((p) => p.status === "menunggu");
      const terjual = produk.filter((p) => p.status === "terjual");

      return res.status(200).json({
        message: "succes",
        semua: produk.length,
        tersedia: tersedia.length,
        menunggu: menunggu.length,
        terjual: terjual.length,
        produk: verifProduk,
      });
    } catch (error) {
      console.log("errorrrrr", error);
      return res.status(500).json({ message: "eror server" });
    }
  },

  async searchProduk(req, res) {
    const { id: iduser } = req.akun;
    const { search } = req.body;
    try {
      const produk = await postingan.findAll({
        where: {
          judul: {
            [Op.substring]: search,
          },
        },
        attributes: ["foto", "penjual", "jenis", "judul", "harga"],
        include: [
          {
            model: toko,
            foreignKey: "pemilik",
            where: {
              pemilik: iduser,
            },
            attributes: [],
          },
        ],
      });

      if (produk.length < 1) {
        return res.status(404).json({ message: "postingan tidak ada" });
      }

      return res.status(200).json({ postingan: produk });
    } catch (error) {
      return res.status(500).json({ message: "eror" });
    }
  },

  async editProduk(req, res) {
    const { id: iduser } = req.akun;
    const idpostingan = req.query.idpostingan;
    const { judul, jenis, deskripsi, berat, harga } = req.body;
    const foto = req.file;

    try {
      const produk = await postingan.findByPk(idpostingan, {
        include: [
          {
            model: toko,
            foreignKey: "pemilik",
            where: {
              pemilik: iduser,
            },
          },
        ],
      });

      if (!produk) {
        return res.status(400).json({ message: "postingan tidak ada!" });
      }

      if (judul) {
        await produk.update({ judul: judul });
      }
      if (jenis) {
        await produk.update({ jenis: jenis });
      }
      if (berat) {
        await produk.update({ berat: berat });
      }
      if (harga) {
        await produk.update({ harga: harga });
      }
      if (deskripsi) {
        await produk.update({ deskripsi: deskripsi });
      }
      if (foto) {
        const compressedImageBuffer = await sharp(foto.buffer)
          .resize(1280, 720)
          .toBuffer();

        const base64CompressedImage = compressedImageBuffer.toString("base64");
        const fotos = `data:${foto.mimetype};base64,` + base64CompressedImage;
        await produk.update({ foto: fotos });
      }

      return res
        .status(200)
        .json({ message: "postingan berhasil di update!", data: produk });
    } catch (error) {
      return res.status(500).json({ message: "error internal server" });
    }
  },

  async deleteProduk(req, res) {
    const { id: iduser } = req.akun;
    const idpostingan = req.query.idpostingan;
    const verif = await verifikasi.findAll({
      where: {
        idpostingan: idpostingan,
      },
    });

    console.log("erere", verif);
    try {
      const verif = await verifikasi.findAll({
        where: {
          idpostingan: idpostingan,
        },
      });

      for (const item of verif) {
        await item.destroy();
      }

      const produk = await postingan.findByPk(idpostingan, {
        include: [
          {
            model: toko,
            foreignKey: "pemilik",
            where: {
              pemilik: iduser,
            },
          },
        ],
      });

      if (!produk) {
        return res.status(400).json({ message: "postingan tidak ada!" });
      }

      await produk.destroy();
      return res.status(200).json({ message: "berhasil terhapus!" });
    } catch (error) {
      return res.status(500).json({ message: "internal server error", error });
    }
  },
};
