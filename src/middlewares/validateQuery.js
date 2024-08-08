import createHttpError from 'http-errors';

export const validateQuery = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.query, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad Request', {
      errors: err.details,
    });
    next(error);
  }
};
