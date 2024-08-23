import { Request, Response } from 'express';

import { PassengerService } from '../services';
import { IUser } from '../types';

const passengerService = new PassengerService();

export const passengerController = {
    getPassengerBookings: async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.user as IUser;
            if (!user || !user._id) {
                res.status(400).send({ success: false, error: 'User not authenticated', message: null });
                return;
            }
            const bookings = await passengerService.getPassengerBookings(user._id);
            res.status(200).send({ data: bookings, success: true, error: null, message: "Retrieved passenger bookings" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    },

    provideFeedback: async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.user as IUser;
            if (!user || !user._id) {
                res.status(400).send({ success: false, error: 'User not authenticated', message: null });
                return;
            }
            const { bookingId, rating, feedback } = req.body;
            await passengerService.provideFeedback(user._id, bookingId, rating, feedback);
            res.status(201).send({ success: true, error: null, message: "Feedback submitted successfully" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    },
};
