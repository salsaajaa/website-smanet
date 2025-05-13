const User = require('../models/dataUserModel')

const getUser = async (req, res) => {
    try {
        // Mengambil data user dari database
        const [users] = await User.getUser()
        
        // Mengirim response sukses
        res.status(200).json({
            status: 'success',
            message: 'Data user berhasil diambil',
            data: users
        })
    } catch (error) {
        console.error('Error pada getUser:', error)
        res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan saat mengambil data user'
        })
    }
}
const createUser=async(req,res)=>{
    const{body}=req
    try {
        // Validasi input
        if (!body.nama || !body.username || !body.password) {
            return res.status(400).json({ 
                message: 'Nama, username, dan password harus diisi' 
            })
        }
        // Cek apakah username sudah digunakan
        const existingUser = await User.findByUsername(body)
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Username sudah digunakan' 
            })
        }

       const post=User.postUser(body)
       return res.status(201).json({message:'register success', data:post}) 
    } catch (error) {
        throw error
    }
}
const deleteUser=async(req,res)=>{
    const{id}=req.params
    try {
        await User.hapusUser(id)
        return res.status(200).json({message:'success'})
    } catch (error) {
        throw error
    }
}
const editUser=async(req,res)=>{
    const{id}=req.params
    try {
        const[data]=await User.editUser(id)
        res.status(200).json({
            message:'sukses',
            data:data[0]
        })
    } catch (error) {
        throw error
    }
}

module.exports = {
    getUser,
    createUser,
    deleteUser,
    editUser
}