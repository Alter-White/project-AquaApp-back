import createHttpError from 'http-errors';

export const mongooseSaveError = (err, data, next) => {
    err.status = 400;
    next(err);
};

const parseNumber = (input, fieldName) => {
    if (typeof input !== 'string') {
        return { success: false, error: `${fieldName} is not a string` };
    }

    const parsedNumber = parseFloat(input);
    if (Number.isNaN(parsedNumber)) {
        return { success: false, error: `${fieldName} must be a number` };
    }

    return { success: true, value: parsedNumber };
};


export const setUpdateSettings = function (next) {
    this.options.new = true;
    this.options.runValidators = true;
    next();
};

export const updateDailyRateWater = function(next) {
    let value;
    let value2;
    const update = this.getUpdate();

    if (update.gender === 'woman') {
        value = 0.03;
        value2 = 0.4;
    } else {
        value = 0.04;
        value2 = 0.6;
    }

    if (update.weight !== undefined || update.sportTime !== undefined) {
        if (update.dailyRateWater === undefined || update.dailyRateWater === 0) {

            const weightResult = parseNumber(update.weight, 'weight');
            const sportTimeResult = parseNumber(update.sportTime, 'sportTime');

            if (!weightResult.success) {
                return next(createHttpError(400, weightResult.error));
            }

            if (!sportTimeResult.success) {
                return next(createHttpError(400, sportTimeResult.error));
            }

            update.weight = weightResult.value;
            update.sportTime = sportTimeResult.value;

            update.dailyRateWater = parseFloat(((update.weight || 0) * value + (update.sportTime || 0) * value2).toFixed(2));
        }
    }
    next();
};