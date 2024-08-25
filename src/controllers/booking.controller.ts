import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { BookingService, locationService } from '../services';
import { io } from '..';
import { IUser } from '../types';
import { logger, redisClient } from '../config';

const bookingService = new BookingService();

export const bookingController = {
    createBooking: (oi: any) => async (req: Request, res: Response) => {
        try {
            const { source, destination } = req.body;
            const user = req.user;
            if (!user || !user._id) {
                res.status(400).send({ success: false, error: 'User not authenticated', message: null });
                return;
            }
            const booking = await bookingService.createBooking({
                passenger: user._id,
                source,
                destination,
            });

            const driverIds: string[] = [];

            const keys: any = await redisClient.sendCommand(['KEYS', '*']);
            for (const driver of keys) {
                // Skipping non-driver key
                if (!driver.startsWith('driver:')) {
                    continue;
                }
                const driverId = driver.replace('driver:', '');
                const driverSocketId = await locationService.getDriverSocket(driverId);
                if (driverSocketId) {
                    driverIds.push(driverId);
                    io.to(driverSocketId).emit('newBooking', {
                        bookingId: booking._id,
                        source,
                        destination,
                        fare: booking.fare,
                    });
                } else {
                    logger.error(`No socket ID found for driver: ${driverId}`);
                }
            }
            const nearbyDrivers = await bookingService.findNearbyDrivers(source);
            logger.info(`Nearby Drivers controller: ${nearbyDrivers}`);
            await locationService.storeNotifiedDrivers(booking._id as mongoose.Schema.Types.ObjectId, driverIds);
            logger.info(`Booking created Successfully: ${booking}`);
            res.status(201).send({ data: booking, success: true, error: null, message: "successfully created booking" });
        } catch (error: any) {
            logger.error(`Error in creating Booking: ${error}`);
            res.status(400).send(error.message);
        }
    },

    confirmBooking: (oi: any) => async (req: Request, res: Response) => {
        try {
            const { bookingId } = req.body;
            const user = req.user as IUser;
            if (!user || !user._id) {
                res.status(400).send({ success: false, error: 'User not authenticated', message: null });
                return;
            }
            const booking = await bookingService.assignDriver(bookingId, String(user._id));
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