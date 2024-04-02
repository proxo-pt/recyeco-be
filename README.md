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

    buat database pada mysql localnya kamu dengan nama **recyeco** biar sesuai nda perlu rubah2 lagi
    **Buka file config/database dan atur parameter-parameter berikut sesuai dengan pengaturan database Anda:**

    ```bash
    "database":"recyeco(sesuai dengan database yang di buat di mysql nya kamu)",
    "username":"root",
    "password":"",
    "host":"localhost",
    "dialect":"mysql"

5. **Jalankan Server**

    ```bash
    npm start

    **or**

    nodemon index

# endpoint
## login
   **endpoint : /login**
   
   **method : POST**

   **Request :    {email,password}**

## register
   **endpoint : /register**

   **method : POST**

   **Request :    { username,password,ttl,jk}**

## sendemail
   **endpoint : /sendemail**

   **method : POST**

   **Request :     { email }**

## reset password
    
   **endpoint : /:iduser/resetpassword**

   **method : POST**

   **Request :    {username,email,password,ttl,jk}**
