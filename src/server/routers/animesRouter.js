const express = require("express");
const {
  getAllAnimes,
  deleteAnime,
} = require("../controllers/animesController/animesController");

const router = express.Router();

router.get("/", getAllAnimes);
router.delete("/:id", deleteAnime);

module.exports = router;
