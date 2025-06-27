const express = require("express");
const {
  login,
  signup: register  // 👈 aliasing "signup" as "register"
} = require("../controllers/users.js"); // ⬅ ensure this points to users.js, not user.controller

const router = express.Router();

router.post("/login", login);
router.post("/signup", register);

module.exports = router;
