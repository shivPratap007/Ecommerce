const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const users = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 30,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      validate: validator.isEmail,
    },
    ProfilePhoto: {
      public_id: {
        type: String,
        required: true,
      },
      URL: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// pre to save the password into the hash
users.pre("save", function (next) {
  if (!this.isModified("Password")) {
    next();
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    this.Password = bcrypt.hashSync(this.Password, salt);
    next();
  } catch (error) {
    console.log(error);
  }
});

// Method to generate tokens
users.methods.generateJwtTokens = function () {
  return jwt.sign(
    {
      data: this._id,
    },
    process.env.SECRET_KEY
  );
};

// method to compare the user entered password and the hash password stored in the DB
users.methods.passwordChecker = function (userPassowrd) {
  return bcrypt.compare(userPassowrd, this.Password);
};

// token for reset password
users.methods.getResetTokens = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to user schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};
const userModel = mongoose.model("users", users);

module.exports = userModel;
