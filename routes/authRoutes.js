const express=require('express')
const router=express.Router()

const {login,logout,register}=require('../controllers/authController.js')

// base: /api/v1/auth

router.post('/login',login)
router.post('/register',register)
router.get('/logout',logout)

module.exports=router;
