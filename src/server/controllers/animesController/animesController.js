const Anime = require("../../../database/models/Anime");

const getAllAnimes = async (req, res) => {
  const animes = await Anime.find();
  res.json({ animes });
};

const deleteAnime = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Anime.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (error) {
    error.message = "cant delete anime";
    next(error);
  }
};

module.exports = { getAllAnimes, deleteAnime };
