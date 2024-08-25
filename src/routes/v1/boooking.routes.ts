import express from 'express';

import authMiddleware from '../../middlewares/auth.middleware';
import { bookingController } from '../../controllers';

const bookingRouter = express.Router();

export default (io: any) => {
    bookingRouter.post('/', authMiddleware, bookingController.createBooking(io));
    bookingRouter.post('/confirm', authMiddleware, bookingController.confirmBooking(io));
    return bookingRouter;
};
