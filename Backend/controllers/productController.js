const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandeling");

// API TO GET ALL THE PRODUCTS
const productController = async (req, res) => {
  try {
    const allProducts = await productModel.find({});
    res.status(201).json({
      allProducts,
    });
  } catch (error) {
    console.log(error);
  }
};

// API TO CREATE ALL THE PRODUCTS
const oneProductController = async (req, res) => {
  try {
    const product = await productModel.create(req.body);
    console.log(product);
    res.send("Data inserted successfully");
  } catch (error) {
    console.log(error);
  }
};

const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    console.log(product);

    if (!product) {
      res.status(400).json({
        status: false,
        message: "Data not found",
      });
    }

    const foundProduct = await productModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Data deleted successfully",
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: false,
      message: "Data not found",
      error: { error },
    });
  }
};

// API TO FIND THE PRODUCT

const findTheProductController = async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    
    return next(new ErrorHandler("Product not found,haha",404));

  } else {
    res.status(200).json({
      status: true,
      message: "Data found",
      data: product,
    });
  }
};

// API TO UPDATE THE PRODUCT
const updateProductController = async (req, res,) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    if (!product) {
      res.status(401).json({
        status: false,
        message: "Product not found",
      });
    }

    else{
        res.status(201).json({
            status:true,
            message:"Data updated successfully",
        })
    }
  } 
  catch (error) {
    res.status(400).json({
      status: false,
      message: "Data not found",
      error: error,
    });
  }
};

module.exports = {
  productController,
  oneProductController,
  deleteProductController,
  findTheProductController,
  updateProductController,
};
