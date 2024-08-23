import mongoose from "mongoose";

import { Booking } from "../models";
import { BookingRepository } from "../repositories";

class PassengerService {
    private bookingRepository: BookingRepository;

    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async getPassengerBookings(passengerId: mongoose.Schema.Types.ObjectId) {
        return Booking.find({ passenger: passengerId });
    };

    async provideFeedback(passengerId: mongoose.Schema.Types.ObjectId, bookingId: mongoose.Schema.Types.ObjectId, rating: number, feedback: string) {
        const booking = await this.bookingRepository.findBookingByCriteria({ _id: bookingId, passenger: passengerId });
        if (!booking) throw new Error('Booking not found');
        booking.rating = rating;
        booking.feedback = feedback;
        await booking.save();
        return true;
    };
}

export default PassengerService;