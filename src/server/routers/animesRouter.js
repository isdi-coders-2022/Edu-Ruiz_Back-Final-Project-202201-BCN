const multer = require("multer");
const express = require("express");
const joiValidator = require("../middlewares/joiValidator");
const {
  getAllAnimes,
  deleteAnime,
  createAnime,
} = require("../controllers/animesController/animesController");

const upload = multer({ dest: "public/animes/" });
const router = express.Router();

router.get("/", getAllAnimes);
router.delete("/:id", deleteAnime);
router.post("/create", upload.single("image"), joiValidator, createAnime);

module.exports = router;
