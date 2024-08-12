export const calculatePercentPerDay = (expectedWater, totalPerDay) => {
  const expectedWaterMl = expectedWater * 1000;
  const percent = Math.round((totalPerDay > expectedWaterMl) ? 100 : (totalPerDay / expectedWaterMl * 100));

  return percent;
};
