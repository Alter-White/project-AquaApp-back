import { Router } from 'express';
import { createWaterController, deleteWaterController, getWaterByDayController, getWaterByMonthController, updateWaterController } from '../controllers/water-controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createWaterSchema, getDayWaterSchema, getMonthWaterSchema, updateWaterSchema } from '../validation/water.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateQuery } from '../middlewares/validateQuery.js';

const waterRouter = Router();

waterRouter.use(authenticate);

waterRouter.post('/', validateBody(createWaterSchema), ctrlWrapper(createWaterController));
waterRouter.patch('/:waterId', isValidId, validateBody(updateWaterSchema), ctrlWrapper(updateWaterController));
waterRouter.delete('/:waterId', isValidId, ctrlWrapper(deleteWaterController));
waterRouter.get('/day', validateQuery(getDayWaterSchema), ctrlWrapper(getWaterByDayController));
waterRouter.get('/month', validateQuery(getMonthWaterSchema), ctrlWrapper(getWaterByMonthController));

export default waterRouter;
