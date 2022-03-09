const express = require("express");
const {
  getAllAnimes,
} = require("../controllers/animesController/animesController");

const router = express.Router();

router.get("/", getAllAnimes);

module.exports = router;
