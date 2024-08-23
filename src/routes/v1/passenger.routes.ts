import express from 'express';

import authMiddleware from '../../middlewares/auth.middleware';
import { passengerController } from '../../controllers';

const passengerRouter = express.Router();

export default (io: any) => {
    passengerRouter.get('/bookings', authMiddleware, passengerController.getPassengerBookings);
    passengerRouter.post('/feedback', authMiddleware, passengerController.provideFeedback);
    return passengerRouter;
};
