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

    **buat database pada mysql localnya kamu dengan nama **recyeco** biar sesuai nda perlu rubah2 lagi**



5. **Jalankan Server**

    ```bash
    npm start
    ```

    **or**

    ```
    nodemon index
    ```

# endpoint
## login
   **endpoint : /login**
   
   **method : POST**

   **Request body :    {email,password}**

   **Response :**
   ```json
   {
      "message:":"login berhasil",
      "id":"usernames.id",
      "token":"token"
   }
   ```

## register
   **endpoint : /register**

   **method : POST**

   **Request body :    { username,password,ttl,jk}**

## sendemail
   **endpoint : /sendemail**

   **method : POST**

   **Request body :     { email }**

## reset password
    
   **endpoint : /:iduser/resetpassword**

   **method : POST**

   **Request body :    {username,email,password,ttl,jk}**

   **Request params : {iduser}**
