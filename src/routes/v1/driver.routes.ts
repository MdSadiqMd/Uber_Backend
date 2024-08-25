import express from 'express';

import authMiddleware from '../../middlewares/auth.middleware';
import { driverController } from '../../controllers';

const driverRoutes = express.Router();

driverRoutes.get('/bookings', authMiddleware, driverController.getDriverBookings);
driverRoutes.post('/location', authMiddleware, driverController.updateLocation);

export default driverRoutes;