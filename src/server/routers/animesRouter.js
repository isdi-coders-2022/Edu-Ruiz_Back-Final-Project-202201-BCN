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
router.get("/:id", getAnime);
router.delete("/:id", deleteAnime);
router.post(
  "/create",
  upload.single("image"),
  validateRepeatUser,
  validate(animeJoiSchema),
  createAnime
);
router.put("/:id", validateRepeatUser, validate(animeJoiSchema), updateAnime);

module.exports = router;
