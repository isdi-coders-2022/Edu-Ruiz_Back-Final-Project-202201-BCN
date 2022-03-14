const { Joi } = require("express-validation");

const animeJoiSchema = Joi.object({
  name: Joi.string().required(),
  autor: Joi.string().required(),
  image: Joi.string(),
});

module.exports = animeJoiSchema;
