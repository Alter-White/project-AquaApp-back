import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  resetEmailSchema,
  resetPasswordSchema,
  validateUserUpdate,
} from '../validation/users.js';
import UserController from '../controllers/user-controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const usersRouter = new Router();

usersRouter.post('/auth/register', validateBody(registerUserSchema), ctrlWrapper(UserController.registration));
usersRouter.post('/auth/login', validateBody(loginUserSchema), ctrlWrapper(UserController.login));
usersRouter.post('/auth/refresh', ctrlWrapper(UserController.refresh));
usersRouter.post('/auth/logout', ctrlWrapper(UserController.logout));
usersRouter.get('/account', authenticate, ctrlWrapper(UserController.getCurrentUser)); //get info about logged in user
usersRouter.patch('/account', authenticate, upload.single('avatar'), validateBody(validateUserUpdate), ctrlWrapper(UserController.patchUser)); //update user
usersRouter.get('/users', ctrlWrapper(UserController.getUsersLength)); //get users length
usersRouter.post('/auth/send-email', validateBody(resetEmailSchema), ctrlWrapper(UserController.resetEmail));
usersRouter.post('/auth/reset-pwd',validateBody(resetPasswordSchema), ctrlWrapper(UserController.resetPassword));

export default usersRouter;