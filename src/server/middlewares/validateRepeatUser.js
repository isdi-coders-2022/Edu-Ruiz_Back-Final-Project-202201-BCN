const debug = require("debug")("anime4me: middleware: validateRepeatUser");
const Anime = require("../../database/models/Anime");

const validateRepeatUser = async (req, res, next) => {
  const { name } = req.body;
  const nameAnimeExists = await Anime.findOne({ name });
  if (nameAnimeExists) {
    const error = new Error(`Anime already exists!`);
    error.code = 400;
    return next(error);
  }
  debug("Anime create is working");
  return next();
};

module.exports = validateRepeatUser;
