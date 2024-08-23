import express from 'express';

import { authController } from '../../controllers';

const userRouter = express.Router();

userRouter.post('/register', authController.register);
userRouter.post('/login', authController.login);

export default userRouter;