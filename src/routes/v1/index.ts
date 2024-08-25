import express from 'express';

import userRouter from './auth.routes';
import passengerRoutes from './passenger.routes';
import boookingRoutes from './boooking.routes';
import driverRoutes from './driver.routes';
import { io } from '../..';

const v1Router = express.Router();

v1Router.use('/auth', userRouter);
v1Router.use('/passengers', passengerRoutes(io));
v1Router.use('/bookings', boookingRoutes(io));
v1Router.use('/drivers', driverRoutes);

export default v1Router;