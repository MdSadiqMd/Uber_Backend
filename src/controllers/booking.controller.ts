import { Request, Response } from 'express';

import { BookingService, locationService } from '../services';
import { io } from '..';
import { IUser } from '../types';
import { logger } from '../config';

export const bookingController = {
    createBooking: (io: any) => async (req: Request, res: Response) => {
        try {
            const { source, destination } = req.body;
            const user = req.user as IUser;
            if (!user || !user._id) {
                res.status(400).send({ success: false, error: 'User not authenticated', message: null });
                return;
            }
            const booking = await BookingService.createBooking({
                passengerId: user._id,
                source,
                destination,
            });

            const driverIds: string[] = [];

            const nearbyDrivers = await BookingService.findNearbyDrivers(source);
            for (const driver of nearbyDrivers) {
                const driverSocketId = await locationService.getDriverSocket(driver[0]);
                if (driverSocketId) {
                    driverIds.push(driver[0]);
                    io.to(driverSocketId).emit('newBooking', {
                        bookingId: booking._id,
                        source,
                        destination,
                        fare: booking.fare,
                    });
                }
            }
            await locationService.storeNotifiedDrivers(booking._id, driverIds);
            logger.info(`Booking created Successfully: ${booking}`);
            res.status(201).send({ data: booking, success: true, error: null, message: "successfully created booking" });
        } catch (error: any) {
            logger.error(`Error in creating Booking: ${error}`);
            res.status(400).send(error.message);
        }
    },

    confirmBooking: (io: any) => async (req: Request, res: Response) => {
        try {
            const { bookingId } = req.body;
            const user = req.user as IUser;
            if (!user || !user._id) {
                res.status(400).send({ success: false, error: 'User not authenticated', message: null });
                return;
            }
            const booking = await BookingService.assignDriver(bookingId, user._id);
            const notifiedDriverIds = await locationService.getNotifiedDrivers(bookingId);
            for (const driverId of notifiedDriverIds) {
                const driverSocketId = await locationService.getDriverSocket(driverId);
                if (driverSocketId) {
                    if (driverId === String(user._id)) {
                        io.to(driverSocketId).emit('rideConfirmed', { bookingId, driverId: user._id });
                    } else {
                        io.to(driverSocketId).emit('removeBooking', { bookingId });
                    }
                }
            }
            logger.info(`Booking Confirmed of User: ${user._id}`);
            res.status(201).send({ data: booking, success: true, error: null, message: "successfully confirmed booking" });
        } catch (error: any) {
            logger.error(`Error in confirming Booking of User: ${error}`);
            res.status(400).send(error.message);
        }
    }
};