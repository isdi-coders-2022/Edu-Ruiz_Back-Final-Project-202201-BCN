const Joi = require("joi");
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

const AnimeJoiSchema = Joi.object({
  name: Joi.string().required,
  autor: Joi.string().required,
  image: Joi.string().required,
});

AnimeSchema.statics.isValid = (object) => AnimeJoiSchema.validate(object);

const Anime = model("Anime", AnimeSchema, "animes");

module.exports = Anime;
