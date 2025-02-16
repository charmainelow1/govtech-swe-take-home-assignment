import Joi from "joi";

const rowSchema = Joi.string()
  .pattern(/^[A-Za-z ]+\s*,\s*-?\d+(\.\d+)?\s*$/)
  .messages({
    'string.pattern.base': 'csv is incorrectly formatted'
});

export default rowSchema;