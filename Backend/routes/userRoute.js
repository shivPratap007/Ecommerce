const express=require('express');
const router=express.Router();
const {createUser, loginController, LogoutController, getResetPasswordToken, resetNewPassword}=require('../controllers/userController')

router.post('/user',createUser);

router.post('/login',loginController);

router.post('/logout',LogoutController);

router.post('/password/forgot',getResetPasswordToken);

router.put('/password/reset/:token',resetNewPassword);

module.exports=router;