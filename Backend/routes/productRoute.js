const express=require('express');

const router=express.Router();

const {productController, oneProductController}=require("../controllers/productController");

router.get('/products',productController);

router.post('/newProduct',oneProductController);

module.exports=router;


