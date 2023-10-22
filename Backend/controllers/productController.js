const productModel=require('../models/productModel');

const productController=async (req,res)=>{
    try{
        const allProducts=await productModel.find({});
        res.status(201).json({
            allProducts
        })
    }
    catch(error){
        console.log(error);
    }
}

const oneProductController=async (req,res)=>{
    try{
        const product=await productModel.create(req.body);
        console.log(product);
        res.send("Data inserted successfully");
        
    }
    catch(error){
        console.log(error)
    }
}

module.exports={
    productController,
    oneProductController,
}