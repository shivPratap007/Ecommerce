const mongoose = require("mongoose");

const product = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
      maxlength: 8,
    },
    Rating: {
      type: Number,
      default: 0,
    },
    Image: [
      {
        PublicID: {
          type: String,
          required: true,
        },
        URL: {
          type: String,
          required: true,
        },
      },
    ],
    Category: {
      type: String,
      required: true,
    },
    Stock: {
      type: Number,
      required: true,
      maxlength: 4,
      default: 1,
    },
    Reviews: [
      {
        User: {
          type: mongoose.Schema.ObjectId,
          ref: "users",
          required: true,
        },
        Name: {
          type: String,
          required: true,
        },
        Rating: {
          type: String,
          required: true,
        },
        Comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

product.methods.updateAverage = async function () {
  let sum = 0;
  this.Reviews.forEach((rev) => {
    sum += parseInt(rev.Rating);
  });
  let avg = sum / parseInt(this.Reviews.length);

  this.Rating = avg;
  await this.save();
  return this.Rating;
};

const productModel = mongoose.model("product", product);

module.exports = productModel;
