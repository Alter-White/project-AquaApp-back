import Joi from 'joi';
import { dateDay, dateMonth } from '../constants/dates.js';

export const getDayWaterSchema = Joi.object({
  date: Joi.string().pattern(dateDay).required(),
});

export const getMonthWaterSchema = Joi.object({
  date: Joi.string().pattern(dateMonth).required(),
});

export const createWaterSchema = Joi.object({
  date: Joi.string().required(),
  volume: Joi.number().min(10).max(3000).required(),
});

export const updateWaterSchema = Joi.object({
  date: Joi.string(),
  volume: Joi.number().min(10).max(3000),
});
