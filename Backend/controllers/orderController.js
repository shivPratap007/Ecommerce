const ErrorHandler = require("../utils/errorHandeling");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

// Create new error
const newOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await orderModel.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.userFromToken._id,
    });

    console.log(order);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(400).json({
      staus: false,
      error: error,
    });
  }
};

// Get single order
const getSingleOrder = async (req, res, next) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate("user", "Name Email");

    if (!order) {
      return next(new ErrorHandler("Order not found", 400));
    }
    console.log(req.params.id);
    res.status(200).json({
      status: true,
      order,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error,
    });
  }
};

// To get all logedin account orders
const myOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.find({ user: req.userFromToken._id });

    res.status(200).json({
      status: true,
      orders,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error,
    });
  }
};

// To get all the orders
const allOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.find();

    let totalAmount = orders.reduce((accumlator, currentValue) => {
      return accumlator + currentValue.totalPrice;
    }, 0);

    res.status(200).json({
      status: true,
      orders,
      totalAmount,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error,
    });
  }
};

// To update the orders --Admin
const updateOrder = async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (order.orderStatus === "Delivered") {
      return next(new ErrorHandler("You have already deliverd this order", 400));
    }

    order.orderItems.forEach(async (order) => {
      await updateStock(order.product, order.quantity);
    });

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      status: true,
    });

    
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error,
    });
  }
};

async function updateStock(id, quantity) {
  const product = await productModel.findById(id);

  product.Stock -= quantity;
  await product.save();
}

// To delete order
const deleteOrder = async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (order.orderStatus === "Delivered") {
      return next(
        new ErrorHandler("You have already deliverd this order", 400)
      );
    }

    const del = await orderModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: true,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      error: error,
    });
  }
};

module.exports = {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  deleteOrder,
  updateOrder,
};
