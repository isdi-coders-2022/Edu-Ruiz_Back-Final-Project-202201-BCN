const express = require("express");
const multer = require("multer");
const {
  userLogin,
  userRegister,
  getAllUsers,
  getUser,
} = require("../controllers/animesController/animesController");

const auth = require("../middlewares/auth");

const upload = multer({ dest: "public/users" });
const router = express.Router();

router.post("/login", userLogin);
router.post("/register", upload.single("image"), userRegister);
router.get("/allusers", auth, getAllUsers);
router.get("/user", auth, getUser);

module.exports = router;
