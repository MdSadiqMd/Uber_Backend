import { Request, Response } from 'express';

import { DriverService } from '../services';
import { ILocation } from '../types';
import { logger } from '../config';

const driverService = new DriverService();

export const driverController = {
    async getDriverBookings(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            if (!userId) {
                res.status(400).send({ data: null, success: false, error: 'User not authenticated', message: null });
                return;
            }

            const bookings = await driverService.getDriverBookings(userId);
            logger.info(`Retrieved Driver details Succesfully`);
            res.status(200).send({
                data: bookings,
                success: true,
                error: null,
                message: "Successfully retrieved driver bookings"
            });
        } catch (error: any) {
            logger.error(`Error in Retriving Drivers: ${error}`);
            res.status(400).send({ error: error.message });
        }
    },

    async updateLocation(req: Request, res: Response): Promise<void> {
        try {
            const { latitude, longitude }: ILocation = req.body;
            logger.info(`Latitude: ${latitude}, Longitude: ${longitude}`);

            if (typeof latitude !== 'number' || typeof longitude !== 'number') {
                throw new Error('Latitude and longitude must be numbers');
            }

            const userId = req.user?._id;
            if (!userId) {
                res.status(400).send({ success: false, error: 'User not authenticated', message: null });
                return;
            }
            await driverService.updateLocation(userId, { latitude, longitude } as ILocation);
            logger.info(`Location Updated Successfully`);
            res.status(200).send({
                success: true,
                error: null,
                message: "Location updated successfully"
            });
        } catch (error: any) {
            logger.error(`Error in Updating Location: ${error}`);
            res.status(400).send({ error: error.message });
        }
    },
};