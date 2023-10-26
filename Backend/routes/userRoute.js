const express=require('express');
const router=express.Router();
const {createUser, loginController}=require('../controllers/userController')

router.post('/user',createUser);

router.post('/login',loginController);

module.exports=router;