const productModel = require("../models/productModel");
const Apifeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandeling");

// API TO GET ALL THE PRODUCTS
const productController = async (req, res, next) => {
  try {
    const search = new Apifeatures(productModel, req.query || {})
      .search()
      .filter()
      .pagination(2);
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
    console.log(req.userFromToken);
    req.body.user = req.userFromToken.id;
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

// Create a new review or update the existing review
const productReview = async (req, res, next) => {
  const { Rating, Comment, productId } = req.body;
  const review = {
    User: req.userFromToken.id,
    Name: req.userFromToken.Name,
    Rating: Number(Rating),
    Comment,
  };

  const product = await productModel.findById(productId);

  const isReviewed = product.Reviews.some((rev) => {
    return rev.User.toString() === req.userFromToken._id.toString();
  });

  if (isReviewed) {
    product.Reviews.forEach((rev) => {
      if (rev.User.toString() === req.userFromToken._id.toString()) {
        rev.Rating = Rating;
        rev.Comment = Comment;
      }
    });
  } else {
    product.Reviews.push(review);
  }
  await product.save();

 
  const average=await product.updateAverage();
  console.log(average);

  res.status(200).json({
    status: true,
    average: average,
    message: "Reviews updated successfully",
  });
};

// Get all reviews
const getAllReviews = async (req, res, next) => {
  const product = await productModel.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("No reviews found", 400));
  }
  res.status(200).json({
    status: true,
    allReviews: product.Reviews,
  });
};

// To delete a review
const deleteReview = async (req, res, next) => {
  let product = await productModel.findById(req.query.id);
  if (
    req.userFromToken.role == "admin" ||
    product.Reviews.some((val) => val.User == req.userFromToken.id)
  ) {
    let index = null;
    product.Reviews.forEach((rev, i) => {
      if (rev.id.toString() === req.query.reviewId.toString()) {
        index = i;
        return;
      }
    });
    let rev = [...product.Reviews];
    rev.splice(index, 1);
    product.Reviews = rev;
    await product.save();
    const average=await product.updateAverage();
    return res.status(200).json({
      status: true,
      allReviews: product.Reviews,
      rating:average,
    });
  }

  return res.status(400).json({
    status: false,
    allReviews: "You are not elegible to delete this data",
  });
};

module.exports = {
  productController,
  oneProductController,
  deleteProductController,
  findTheProductController,
  updateProductController,
  productReview,
  getAllReviews,
  deleteReview,
};
