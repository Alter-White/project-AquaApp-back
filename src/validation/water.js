import Joi from 'joi';

export const createWaterSchema = Joi.object({
  date: Joi.string().required(),
  volume: Joi.number().min(10).max(3000).required(),
});

export const updateWaterSchema = Joi.object({
  date: Joi.string(),
  volume: Joi.number().min(10).max(3000),
});
