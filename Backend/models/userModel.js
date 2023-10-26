const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken');

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
users.pre("save",function (next) {
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
users.methods.generateJwtTokens=function(){
    return jwt.sign({
        data:this._id
    },process.env.SECRET_KEY,)
};


// method to compare the user entered password and the hash password stored in the DB
users.methods.passwordChecker=function(userPassowrd){
    return bcrypt.compare(userPassowrd, this.Password);
};
const userModel = mongoose.model("users", users);

module.exports = userModel;
