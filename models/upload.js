import Joi from "joi";

const csvDataSchema = Joi.object({
    name: Joi.string()
      .required()
      .messages({
        'string.base': 'csv file is incorrectly formatted: name must be a string',
        'any.required': 'csv file is incorrectly formatted: name is required for each row',
      }),
    salary: Joi.number()
      .required()
      .messages({
        'number.base': 'csv file is incorrectly formatted: salary must be a number',
        'any.required': 'csv file is incorrectly formatted: name is required for each row',
      }),
});

export default csvDataSchema;