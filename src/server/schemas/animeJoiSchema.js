const Joi = require("joi");

const animeJoiSchema = Joi.object({
  name: Joi.string().max(3).required(),
  autor: Joi.string().required(),
  image: Joi.string(),
});

module.exports = animeJoiSchema;
