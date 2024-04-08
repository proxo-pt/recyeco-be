# Backend Express MySQL

Ini adalah repository backend yang menggunakan **Express** dan **MySQL** untuk membangun API. Repository ini disiapkan agar dapat digunakan oleh anak-anak Front-End (FE) untuk mengembangkan aplikasi mereka.

## Persyaratan

Sebelum Anda dapat menggunakan backend ini, pastikan Anda memenuhi persyaratan-persyaratan berikut:

- **Node.js** (versi 14 atau yang lebih baru)
- **MySQL** (instalasi lokal atau server MySQL eksternal)
- **npm** (Node Package Manager)

## Instalasi

Berikut adalah langkah-langkah untuk menginstal dan menjalankan backend Express MySQL:

1. **Clone repository**

   ```bash
   git clone https://github.com/syarifsakur/recyeco-be.git

2. **Pindah ke direktori proyek**

    ```bash
    cd recyeco-be

3. **Instal dependensi**

    ```bash
    npm install

4. **Konfigurasi Database**

    1.install xampp

    2.nyalakan(start) apache dan mysql

    3.ke website phpmyadmin atau tekan admin pada mysql

    4.buat database pada mysql localnya kamu dengan nama **recyeco** biar sesuai nda perlu rubah2 lagi



5. **Jalankan Server**

    ```bash
    npm start
    ```

    **or**

    ```
    nodemon index
    ```

# endpoint

### server :
   **localhost:1000/**

   cara penggunaanya misal localhost:1000/endpoint

# AUTH
## login
   **endpoint : /login**
   
   **method : POST**

   **Request body :**
   ```json
   {
      "email":"email",
      "password":"password"
   }
   ```

   <!-- **Response :**
   ```json
   {
      "message:":"login berhasil",
      "id":"usernames.id",
      "token":"token"
   }
   ``` -->

## register
   **endpoint : /register**

   **method : POST**

   **Request body :**
   ```json
   {
      "username":"username",
      "email":"email",
      "password":"password"
   }
   ```

## sendemail
   **endpoint : /sendemail**

   **method : POST**

   **Request body :**
   ```json
   {
      "email":"email",
   }
   ```

## reset password
    
   **endpoint : /:iduser/resetpassword**

   **method : POST**

   **Request params : {iduser}**

   **Request body :**
   ```json
   {
      "newpassword":"newpassword",
      "confirmpassword":"confirmpassword",
   }
   ```

# PROFIL
## myprofil

   **endpoint : /profil/:iduser**

   **method : GET**

## Edit Profil

   **endpoint  : /profil/edit**

   **method : PUT**

   **Request body(form-data) :**
   ```json
   {
      "email":"",
      "username":"",
      "ttl":"",
      "foto":"",
      "jk":""
   }
   ```

# yuhu
## daftar toko

   **endpoint  :  /daftartoko**

   **method :  POST**

   **Request body :**
   ```json
   {
      "foto":"",
      "kontak":"",
      "lokasi"
   }
   ```

## ADD Postingan

   **endpoint  :  /addpostingan**

   **method :  POST**

   **Request body(body-form) :**
   ```json
   {
      "judul":"",
      "jenis":"",
      "deskripsi":"",
      "berat":"",
      "harga":"",
      "lokasi":"",
      "foto":""
   }
   ```