const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../middlewares/auth");
const {
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
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

router.post("/user", createUser);

router.post("/login", loginController);

router.post("/logout", LogoutController);

router.post("/password/forgot", getResetPasswordToken);

router.put("/password/reset/:token", resetNewPassword);

router.get("/me", auth, userDetails);

router.put("/password/update", auth, changePassword);

router.put("/me/update", auth, updateUserProfile);

router.get("/admin/users", auth, adminAuth("admin"), getAllUsers);

router.get("/admin/user/:id", auth, adminAuth("admin"), getSpecificUser);

router.put("/admin/user/:id",auth, adminAuth('admin'), updateUserRole);

router.delete("/admin/user/:id",auth, adminAuth('admin'), deleteUser);


module.exports = router;
