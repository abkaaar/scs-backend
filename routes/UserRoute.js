const express = require("express");
const {
   registerUser,
   loginUser,
   getCurrentUser,
   forgotPassword,
   resetPassword,
   verifyCode,
} = require("../controllers/UserController");
const userVerification = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/auth/signup", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/verification", verifyCode);
router.post("/user", userVerification, getCurrentUser);
router.post("/forgotpassword", forgotPassword);
router.put("/passwordreset/:resetToken", resetPassword);


module.exports = router;
