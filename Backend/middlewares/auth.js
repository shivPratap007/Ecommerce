const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const auth = async (req, res, next) => {
  const cookie = req.cookies;

  if (!cookie.token) {
    return next(new Error("Invalid token", 400));
  }
  var decoded = jwt.verify(cookie.token, process.env.SECRET_KEY);
  const findUserFromToken = await userModel.findById(decoded.data);
  if (!findUserFromToken) {
    return next(new Error("User not found", 400));
  }
  req.userFromToken = findUserFromToken;
  next();
};

const adminAuth = (...roles) => {
  return (req, res, next) => {
    if(req.userFromToken.role!=roles[0]){
        return next(new Error("This authority is not accessed by you",400));
    }
    next();
  };
};

module.exports = { auth, adminAuth };
