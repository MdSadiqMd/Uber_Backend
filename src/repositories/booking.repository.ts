import mongoose from "mongoose";

import { Booking } from "../models";
import { IBooking } from "../types";

class BookingRepository {
    async createBooking(bookingData: IBooking): Promise<IBooking> {
        const booking = new Booking(bookingData);
        await booking.save();
        return booking;
    }

    async findBookingById(bookingId: mongoose.Schema.Types.ObjectId): Promise<IBooking | null> {
        return Booking.findById(bookingId).exec();
    }

    async findBookingsByUserId(userId: mongoose.Schema.Types.ObjectId, role: 'driver' | 'passenger'): Promise<IBooking[]> {
        if (role === 'driver') {
            return Booking.find({ driver: userId }).exec();
        } else if (role === 'passenger') {
            return Booking.find({ passenger: userId }).exec();
        }
        throw new Error('Invalid role');
    }

    async updateBookingStatus(bookingId: mongoose.Schema.Types.ObjectId, driverId: mongoose.Schema.Types.ObjectId, status: 'pending' | 'confirmed' | 'completed'): Promise<IBooking | null> {
        return Booking.findOneAndUpdate(
            { _id: bookingId, status: 'pending' },
            { driver: driverId, status },
            { new: true }
        ).exec();
    }

    async findBookingByCriteria(criteria: any): Promise<IBooking | null> {
        return Booking.findOne(criteria).exec();
    }
}

export default BookingRepository;