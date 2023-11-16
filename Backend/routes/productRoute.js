const express=require('express');

const router=express.Router();

const {productController, oneProductController, deleteProductController, findTheProductController, updateProductController, productReview, getAllReviews, deleteReview}=require("../controllers/productController");

const {auth,adminAuth}=require('../middlewares/auth');
const productModel = require('../models/productModel');


router.get('/products',productController);

router.post('/admin/newProduct',auth,adminAuth('admin'),oneProductController);

router.delete('/admin/product/:id',auth,adminAuth('admin'),deleteProductController);

router.get('/product/:id', findTheProductController);

router.patch('/admin/product/:id',auth,adminAuth('admin'), updateProductController);

router.patch('/review',auth,productReview);

router.get('/allReviews', auth,getAllReviews);

router.delete('/deleteReview', auth ,deleteReview);

module.exports=router;


