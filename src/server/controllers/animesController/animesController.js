const Anime = require("../../../database/models/Anime");

const getAllAnimes = async (req, res) => {
  const animes = await Anime.find();
  res.json({ animes });
};

module.exports = { getAllAnimes };
