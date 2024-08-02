import Joi from 'joi';

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const validateUserUpdate = Joi.object({
  name: Joi.string().min(3).max(20),
  email:  Joi.string().email(),
  gender: Joi.string().valid('man', 'woman'),
  weight: Joi.string().optional(),
  sportTime: Joi.string().optional(),
  dailyRateWater: Joi.string().optional(),
});
