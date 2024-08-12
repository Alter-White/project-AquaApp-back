import { WaterCollection } from '../db/models/water.js';
import { calculatePercentPerDay } from '../utils/calculatePercentPerDay.js';

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

export const getWaterByMonth = async ( inputDate, expectedWater, userId ) => {
  const [year, month] = inputDate.split('-');
  const numberOfDays = new Date(year, month, 0).getDate();
  const startOfMonth = `${inputDate}-01T00:00:00`;
  const endOfMonth = `${inputDate}-${String(numberOfDays).padStart(2, '0')}T23:59:59`;

  const query = [
    {
      $match: {
        userId,
        date: {
          $gte: startOfMonth,
          $lt: endOfMonth
        }
      }
    },
    {
      $group: {
        _id: {$substr: ["$date", 0, 10]},
        totalVolume: { $sum: '$volume' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ];

  const waterDay = await WaterCollection.aggregate(query);

  const results = Array.from({ length: numberOfDays }, (_, i) => ({
    date: `${inputDate}-${String(i + 1).padStart(2, '0')}`,
    dailyProgress: 0
  }));

  waterDay.forEach(water => {
    const i = Number(water._id.slice(-2)) - 1;
    results[i].dailyProgress = calculatePercentPerDay(expectedWater, water.totalVolume);
  });

  return results;
};
