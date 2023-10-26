const ErrorHandler = require("../utils/errorHandeling");
const userModel = require("../models/userModel");

// To create the user
const createUser = async (req, res, next) => {
  try {
    const { Name, Email, Password } = req.body;
    const setUser = await userModel.create({
      Name,
      Email,
      Password,
      ProfilePhoto: {
        public_id: "test",
        URL: "test",
      },
    });
    const token = setUser.generateJwtTokens();
    if (!setUser) {
      return next(new ErrorHandler("Invalid data", 401));
    }
    res.json({
      token: token,
      status: true,
    });
  } catch (error) {
    res.status(401).json({
      status: false,
      error: error.message,
    });
  }
};

// For login
const loginController = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;
    
    console.log(Email,Password);
    if (!Email || !Password) {
      return next(new ErrorHandler("Enter the full information", 400));
        
    }

    const result = await userModel.findOne({ Email });
    console.log(result);
    if (!result) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPassowrdCorrect = await result.passwordChecker(Password);
    if (!isPassowrdCorrect) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }
    const token=result.generateJwtTokens();
    res.status(200).json({
      status: true,
      token:token,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginController,
};
