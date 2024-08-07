import { WaterCollection } from '../db/models/water.js';

export const createWater = async (payload) => await WaterCollection.create(payload);;

export const updateWater = async (waterId, payload, userId, options = {}) => {
  const rawResult = await WaterCollection.findOneAndUpdate(
    { _id: waterId, userId: userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    water: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteWater = async (waterId, userId) => {
  const water = await WaterCollection.findOneAndDelete({
    _id: waterId, userId: userId,
  });
  return water;
};

export const getWaterByDay = async (inputDate, userId) => {
  const [year, month, day] = inputDate.split('-').map(Number);

  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  return await WaterCollection.find({
    createdAt: { $gte: startOfDay, $lt: endOfDay },
    userId,
  });
};

export const getWaterByMonth = async (inputDate, userId) => {
  const [year, month] = inputDate.split('-').map(Number);

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  return await WaterCollection.find({
    createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    userId,
  });
};
