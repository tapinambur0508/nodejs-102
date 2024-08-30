import Joi from 'joi';

export const studentSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should be at least {#limit}',
    'string.max': 'Name should be at most {#limit}',
    'any.required': 'Name should be exists',
  }),
  gender: Joi.string().valid('male', 'female').required(),
  email: Joi.string().email().required(),
  year: Joi.number().required(),
  duty: Joi.boolean(),
});

export const studentDutySchema = Joi.object({
  duty: Joi.boolean().required(),
});
