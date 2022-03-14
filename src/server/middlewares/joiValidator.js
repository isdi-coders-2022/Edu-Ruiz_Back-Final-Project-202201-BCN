const debug = require("debug")("anime4me: middleware: JoiValidation");
const chalk = require("chalk");
const animeJoiSchema = require("../schemas/animeJoiSchema");

const joiValidator = (req, res, next) => {
  const { error: validationError } = animeJoiSchema.validate(req.body);
  if (validationError) {
    debug(chalk.bgRed("ERROR: Joi Validation"));
    const error = new Error(validationError.details[0].message);
    error.status = 401;
    return next(error);
  }
  return next();
};

module.exports = joiValidator;
