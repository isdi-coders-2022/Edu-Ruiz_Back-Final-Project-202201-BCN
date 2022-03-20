const multer = require("multer");
const express = require("express");
const { validate } = require("express-validation");
const {
  getAllAnimes,
  deleteAnime,
  createAnime,
  updateAnime,
  getAnime,
} = require("../controllers/animesController/animesController");
const animeJoiSchema = require("../schemas/animeJoiSchema");
const validateRepeatUser = require("../middlewares/validateRepeatUser");

const upload = multer({ dest: "public/animes/" });
const router = express.Router();

router.get("/", getAllAnimes);
router.post(
  "/create",
  upload.single("image"),
  validateRepeatUser,
  validate(animeJoiSchema),
  createAnime
);
router.get("/:id", getAnime);
router.delete("/:id", deleteAnime);
router.patch("/:id", upload.single("image"), updateAnime);

module.exports = router;
