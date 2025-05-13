const db = require('../config/database')
const bcrypt = require('bcryptjs')
// Fungsi untuk mengambil semua data user
const getUser = async () => {
    try {
        const query = 'SELECT * FROM users'
        return await db.execute(query)
    } catch (error) {
        throw error
    }
}
const postUser=async(body)=>{
    if(body.id){
        try {
            const hashedPassword = bcrypt.hashSync(body.password, 10)
             const query=`UPDATE FROM users SET name='${body.nama}',username='${body.username}',password='${hashedPassword}'
                WHERE id='${body.id}'`
            return await db.execute(query)
        } catch (error) {
            throw error
        }
    }else{
        try {
            const hashedPassword = bcrypt.hashSync(body.password, 10)
            const query=`INSERT INTO users (name,username,password) VALUES('${body.nama}','${body.username}','${hashedPassword}')`
            return db.execute(query)
        } catch (error) {
            throw error
        }
    }
    
}
const findByUsername=async(body)=>{
    try {
        // Validasi username
        if (!body.username) {
            throw new Error('Username tidak boleh kosong')
        }
        // Query untuk mencari user
        const query = 'SELECT * FROM users WHERE username = ?'
        
        // Menjalankan query
        const [rows] = await db.execute(query, [body.username])
        // Mengembalikan data user (null jika tidak ditemukan)
        return rows[0]
    } catch (error) {
        throw error
    }
}
const hapusUser=async(id)=>{
    const query=`DELETE FROM users WHERE id='${id}'`
    return await db.execute(query)
}
const editUser=async(id)=>{
    const query=`SELECT * FROM users WHERE id='${id}'`
    return await db.execute(query)
}

module.exports = {
    getUser,
    postUser,
    findByUsername,
    hapusUser,
    editUser
}
