const ErrorHandler = require("../utils/errorHandeling");
const userModel = require("../models/userModel");
const sentToken = require("../utils/jwtTokens");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const hashPassword = require("../utils/updatePasswordHashGenerator");

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

    sentToken(setUser, 200, res);
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

    if (!Email || !Password) {
      return next(new ErrorHandler("Enter the full information", 400));
    }

    const result = await userModel.findOne({ Email });
    if (!result) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }
    const isPassowrdCorrect = await result.passwordChecker(Password);
    if (!isPassowrdCorrect) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }
    sentToken(result, 202, res); // We are able to send the whole response object
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// For logout

const LogoutController = async (req, res, next) => {
  res.clearCookie("token");

  res.status(200).json({
    status: true,
    message: "logout successful",
  });
};

// Forgot password

const getResetPasswordToken = async (req, res, next) => {
  const user = await userModel.findOne({ Email: req.body.Email });
  if (!user) {
    return next(new ErrorHandler("Email id not found", 404));
  }
  // Generate the reset password token
  const resetToken = user.getResetTokens();
  // Saving the reset password token in DB
  await user.save({ validateBeforeSave: false });

  const resetPassword = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is => ${resetPassword} \n \n If you have not requested this email then please ignore it`;

  try {
    await sendEmail({
      Email: user.Email,
      subject: "Ecommerce password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.Email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 400));
  }
};

const resetNewPassword = async (req, res, next) => {
  console.log(req.params.token);
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Reset Password Token is expired", 400));
  }

  if (req.body.Password != req.body.ConfirmPassword) {
    return next(
      new ErrorHandler(
        "Password and confirm Password does not match with each other",
        400
      )
    );
  }

  user.Password = req.body.Password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sentToken(user, 200, res);
};

// User details --it will only be accessed when user is login
const userDetails = async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.userFromToken.id });
  res.status(200).json({
    status: true,
    data: user,
  });
};

// Update Password

const changePassword = async (req, res, next) => {
  const { newPassword, confirmPassword, oldPassword } = req.body;

  const user = await userModel.findOne({ _id: req.userFromToken.id });

  const isOldPasswordCorrect = await user.passwordChecker(oldPassword);

  if (!isOldPasswordCorrect) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New Password and Confirm Password are not same", 400)
    );
  }

  const hashedPassword = await hashPassword(newPassword);
  await userModel.findByIdAndUpdate(req.userFromToken.id, {
    Password: hashedPassword,
  });

  sentToken(user, 200, res);
};

// Update user profile

const updateUserProfile = async (req, res, next) => {
  console.log(req.body);
  const userNewData = {
    Name: req.body.Name,
    Email: req.body.Email,
  };

  const user = await userModel.findByIdAndUpdate(
    req.userFromToken._id,
    userNewData,
    {
      new: true,
      runValidators: true,
      userFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
};

// Get all users (Admin)

const getAllUsers = async (req, res, next) => {
  const users = await userModel.find({}, "-Password");
  res.status(200).json({
    users,
  });
};

// Get the details of the specific user (Admin)

const getSpecificUser = async (req, res, next) => {
  const user = await userModel.findById(req.params.id, "-Password");

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist of id ${req.params.id}`),
      400
    );
  }
  res.status(200).json({
    data: user,
  });
};

// Update user role (Admin)
const updateUserRole = async (req, res, next) => {
  console.log(req.body.Role);

  const user = await userModel.findByIdAndUpdate(
    req.params.id,
    { $set: { role: "admin" } },
    { new: true, runValidators: true }
  );
  console.log(user);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
  });
};

// Delete user (Admin)
const deleteUser = async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id ${req.params.id}`, 404)
    );
  }

  const result=await userModel.deleteOne({ _id: req.params.id });

  res.status(200).json({
    status: true,
  });
};



module.exports = {
  createUser,
  loginController,
  LogoutController,
  getResetPasswordToken,
  resetNewPassword,
  userDetails,
  changePassword,
  updateUserProfile,
  getAllUsers,
  getSpecificUser,
  updateUserProfile,
  updateUserRole,
  deleteUser,
};
