import createHttpError from 'http-errors';
import { createWater, updateWater, deleteWater, getWaterByDay, getWaterByMonth } from '../services/water.js';

export const createWaterController = async (req, res, next) => {
  const { _id: userId } = req.user;

  const water = await createWater({
    ...req.body,
    userId: userId,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created!',
    data: water,
  });
};

export const updateWaterController = async (req, res, next) => {
  const { waterId } = req.params;
  const { _id: userId } = req.user;
  const result = await updateWater(waterId, {
    ...req.body,
  }, userId);

  if (!result) {
    next(createHttpError(404, 'Water item is not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated!',
    data: result.water,
  });
};

export const deleteWaterController = async (req, res, next) => {
  const { waterId } = req.params;
  const { _id: userId } = req.user;

  const water = await deleteWater(waterId, userId);

  if (!water) {
    next(createHttpError(404, 'Water item is not found'));
  }

  res.status(204).send();
};

export const getWaterByDayController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const result = await getWaterByDay(req.body.date, userId);

  const totalPerDay = result.reduce((sum, item) => sum + item.volume, 0);

  res.status(200).json({
    status: 200,
    message: `Total volume per day ${totalPerDay}`,
    data: { totalPerDay, userId: req._id },
  });
};

export const getWaterByMonthController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const result = await getWaterByMonth(req.body.date, userId);

  const totalPerMonth = result.reduce((sum, item) => sum + item.volume, 0);

  res.status(200).json({
    status: 200,
    message: `Total volume per month ${totalPerMonth}`,
    data: { totalPerMonth, userId: req._id },
  });
};
