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
  const { dailyRateWater: expectedWater } = req.user;
  const { date } = req.query;
  const dayItems = await getWaterByDay(date, userId, expectedWater);

  const totalPerDay = dayItems.reduce((sum, item) => sum + item.volume, 0);
  const percentPerDay = Math.round((totalPerDay > expectedWater) ? 100 : (totalPerDay / expectedWater * 10000));

  res.status(200).json({
    status: 200,
    message: `Total volume per day is ${totalPerDay}ml or ${percentPerDay}%`,
    data: { totalPerDay, percentPerDay, dayItems, userId: req._id },
  });
};

export const getWaterByMonthController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { date } = req.query;
  const result = await getWaterByMonth(date, userId);

  const totalPerMonth = result.reduce((sum, item) => sum + item.volume, 0);

  res.status(200).json({
    status: 200,
    message: `Total volume per month ${totalPerMonth}ml`,
    data: { totalPerMonth, userId: req._id },
  });
};
