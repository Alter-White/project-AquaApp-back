import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { waterId } = req.params;
  if (!isValidObjectId(waterId)) {
    throw createHttpError(404, 'ID is not valid');
  }

  next();
};
