const productModel = require("../models/productModel");
const Apifeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandeling");

// API TO GET ALL THE PRODUCTS
const productController = async (req, res, next) => {
  try {
    const search = new Apifeatures(productModel, req.query || {}).search().filter().pagination(2);
    var allProducts = await search.modelN;

    if (!allProducts) {
      return next(new ErrorHandler("Data not found", 400));
    } else {
      res.status(201).json({
        allProducts,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: false,
      message: error.message,
    });
  }
};

// API TO CREATE ONE THE PRODUCTS
const oneProductController = async (req, res, next) => {
  try {
    const product = await productModel.create(req.body);
    console.log(product);
    if (!product) {
      return next(new ErrorHandler("Product not created", 400));
    } else {
      res.status(200).json({
        status: true,
        message: "Product created successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: false,
      message: error.message,
    });
  }
};

// API TO DELETE THE PRODUCT
const deleteProductController = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    console.log(product);

    if (!product) {
      return next(ErrorHandler(400, "Data not found"));
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
      message: error.message,
    });
  }
};

// API TO FIND THE PRODUCT

const findTheProductController = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found,haha", 404));
    } else {
      res.status(200).json({
        status: true,
        message: "Data found",
        data: product,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: false,
      message: error.message,
    });
  }
};

// API TO UPDATE THE PRODUCT
const updateProductController = async (req, res) => {
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
    } else {
      res.status(201).json({
        status: true,
        message: "Data updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: false,
      message: error.message,
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
