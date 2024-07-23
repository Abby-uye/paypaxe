const express = require('express');
const router = express.Router();
const {register,verifyUser,resendCodeToUser,getPaypaxeUserDetails,updatePaypaxeUser} = require("../controllers/userController")

router.route("/register").post(register);
router.route("/verify").post(verifyUser)
router.route("/resend_code").post(resendCodeToUser)
router.route("/user_details").post(getPaypaxeUserDetails)
router.route("/update_user_details").patch(updatePaypaxeUser)

module.exports = router;