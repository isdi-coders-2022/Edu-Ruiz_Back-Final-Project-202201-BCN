const express = require("express");
const multer = require("multer");
const {
  getAllAnimes,
  deleteAnime,
  createAnime,
} = require("../controllers/animesController/animesController");

const upload = multer({ dest: "public/animes/" });
const router = express.Router();

router.get("/", getAllAnimes);
router.delete("/:id", deleteAnime);
router.post("/create", upload.single("image"), createAnime);

module.exports = router;
