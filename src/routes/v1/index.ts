import express from 'express';

import userRouter from './auth.routes';
import passengerRoutes from './passenger.routes';
import { io } from '../..';

const v1Router = express.Router();

v1Router.use("/auth", userRouter);
v1Router.use('/passengers', passengerRoutes(io));

export default v1Router;