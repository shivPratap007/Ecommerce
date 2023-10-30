const express=require('express');

const router=express.Router();

const {productController, oneProductController, deleteProductController, findTheProductController, updateProductController}=require("../controllers/productController");

const {auth,adminAuth}=require('../middlewares/auth');


router.get('/products',productController);

router.post('/newProduct',auth,adminAuth('admin'),oneProductController);

router.delete('/product/:id',auth,adminAuth('admin'),deleteProductController);

router.get('/product/:id', findTheProductController);

router.patch('/product/:id',adminAuth('admin'), updateProductController);

module.exports=router;


