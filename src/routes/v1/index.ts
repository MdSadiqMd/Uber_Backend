import express from 'express';

import userRouter from './auth.routes';

const v1Router = express.Router();

v1Router.use("/auth", userRouter);

export default v1Router;