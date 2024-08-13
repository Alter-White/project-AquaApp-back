import createHttpError from 'http-errors';
import { UsersCollection } from './user.js';

export const mongooseSaveError = (err, data, next) => {
    err.status = 400;
    next(err);
};

const parseNumber = (input, fieldName) => {
    if (typeof input !== 'string' && typeof input !== 'number') {
        return { success: false, error: `${fieldName} is not a valid number or string` };
    }

    const parsedNumber = parseFloat(input);
    if (Number.isNaN(parsedNumber)) {
        return { success: false, error: `${fieldName} must be a number` };
    }

    return { success: true, value: parsedNumber };
};


export const setUpdateSettings = function(next) {
    this.options.new = true;
    this.options.runValidators = true;
    next();
};

export const updateDailyRateWater = async function(next) {
    const update = this.getUpdate();
    const userId = this.getQuery()._id;

    let value;
    let value2;

    if (update.gender === 'woman') {
        value = 0.03;
        value2 = 0.4;
    } else {
        value = 0.04;
        value2 = 0.6;
    }

    try {
        const currentUser = await UsersCollection.findById(userId);

        if (!currentUser) {
            return next(createHttpError(404, 'User not found'));
        }

        let weight = currentUser.weight || 0;
        let sportTime = currentUser.sportTime || 0;

        if (update.weight !== undefined) {
            const weightResult = parseNumber(update.weight, 'weight');
            if (!weightResult.success) {
                return next(createHttpError(400, weightResult.error));
            }
            weight = weightResult.value;
        }

        if (update.sportTime !== undefined) {
            const sportTimeResult = parseNumber(update.sportTime, 'sportTime');
            if (!sportTimeResult.success) {
                return next(createHttpError(400, sportTimeResult.error));
            }
            sportTime = sportTimeResult.value;
        }

        update.weight = weight;
        update.sportTime = sportTime;

        if (update.dailyRateWater === undefined || update.dailyRateWater === 0) {
            update.dailyRateWater = parseFloat(((weight * value) + (sportTime * value2)).toFixed(2));
        }

        next();
    } catch (err) {
        next(err);
    }
};