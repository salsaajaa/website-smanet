const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// Endpoint untuk mendapatkan semua data user
router.get('/', userController.getUser)
router.post('/', userController.createUser)
router.delete('/:id', userController.deleteUser)
router.get('/:id', userController.editUser)

module.exports = router