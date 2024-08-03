import { Router } from 'express';
import { createWaterController, deleteWaterController, getWaterByDayController, getWaterByMonthController, updateWaterController } from '../controllers/water-controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createWaterSchema, updateWaterSchema } from '../validation/water.js';
import { authenticate } from '../middlewares/authenticate.js';

const waterRouter = Router();

waterRouter.use(authenticate);

waterRouter.post('/', validateBody(createWaterSchema), ctrlWrapper(createWaterController));
waterRouter.patch('/:waterId', isValidId, validateBody(updateWaterSchema), ctrlWrapper(updateWaterController));
waterRouter.delete('/:waterId', isValidId, ctrlWrapper(deleteWaterController));
waterRouter.get('/day', ctrlWrapper(getWaterByDayController));
waterRouter.get('/month', ctrlWrapper(getWaterByMonthController));

export default waterRouter;
