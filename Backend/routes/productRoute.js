const express=require('express');

const router=express.Router();

const {productController, oneProductController, deleteProductController, findTheProductController, updateProductController}=require("../controllers/productController");

router.get('/products',productController);

router.post('/newProduct',oneProductController);

router.delete('/product/:id',deleteProductController);

router.get('/product/:id', findTheProductController);

router.patch('/product/:id', updateProductController)

module.exports=router;


