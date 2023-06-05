const {
  signUp,
  signIn,
  verifyEmail,
  forgotPassword,
} = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.get("/verify-email", verifyEmail);

router.put("/forgot-password", forgotPassword);

module.exports = router;
