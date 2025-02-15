import Joi from "joi";

const userQuerySchema = Joi.object({
    min: Joi.number()
      .min(0)
      .default(0.0)
      .messages({
        'number.base': 'min must be a number',
        'number.min': 'min must be at least 0'
      }),
    max: Joi.number()
      .default(4000.00)
      .greater(Joi.ref('min'))
      .messages({
        'number.base': 'max must be a number',
        'number.greater': 'max must be greater than min'
      }),
    offset: Joi.number()
      .default(0)
      .integer()
      .min(0)
      .messages({
        'number.base': 'offset must be an integer',
        'number.integer': 'offset must be an integer',
        'number.min': 'offset must be at least 0'
      }),
    limit: Joi.number()
      .default(-1)
      .integer()
      .min(1)
      .messages({
        'number.base': 'limit must be an integer',
        'number.integer': 'limit must be an integer',
        'number.min': 'limit must be at least 1'
      }),
    sort: Joi.string()
      .default('None')
      .pattern(/^(name|salary)$/i)
      .messages({
        'string.pattern.base': 'sort must be either \'name\' or \'salary\' (non-case-sensitive)'
      }),
});

export default userQuerySchema;