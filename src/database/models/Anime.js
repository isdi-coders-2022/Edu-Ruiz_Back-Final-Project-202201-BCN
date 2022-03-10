const { model, Schema } = require("mongoose");

const AnimeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  autor: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Anime = model("Anime", AnimeSchema, "animes");

module.exports = Anime;
