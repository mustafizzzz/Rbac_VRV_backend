const express = require('express');
const { verifyJWT } = require('../middleware/auth');
const { registerUser, loginUser, logoutUser, refreshAccessToken, otpVerifyController } = require('../controllers/userController');
console.log(registerUser, loginUser, logoutUser, refreshAccessToken);



const router = express.Router();


//routing to controller
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/otp-verify").post(otpVerifyController);



module.exports = router;