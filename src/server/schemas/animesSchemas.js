const Joi = require("joi");

const AnimeJoiSchema = Joi.object({
  name: Joi.string().required,
  autor: Joi.string().required,
  image: Joi.string().required,
});

export default AnimeJoiSchema;
