import mongoose from 'mongoose';

import { locationService } from './location.service';
import { BookingRepository } from '../repositories';
import haversineDistance from '../utils/haversineDistance.util';
import { IBooking, ILocation } from '../types';
import { logger } from '../config';

const BASIC_FARE = 50;
const RATE_PER_KM = 12;

class BookingService {
    private bookingRepository: BookingRepository;

    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking({ passenger, source, destination }: { passenger: mongoose.Schema.Types.ObjectId, source: ILocation, destination: ILocation; }): Promise<IBooking> {
        const distance = haversineDistance(source.latitude, source.longitude, destination.latitude, destination.longitude);
        logger.info(`Distance of ride is ${distance}`);
        const fare = BASIC_FARE + (distance * RATE_PER_KM);
        logger.info(`Fare of the ride is ${fare}`);
        const bookingData: Partial<IBooking> = {
            passenger,
            source,
            destination,
            fare,
            status: 'pending',
        };
        const booking = await this.bookingRepository.createBooking(bookingData as unknown as IBooking);
        return booking;
    };

    async findNearbyDrivers(location: ILocation, radius: number = 5): Promise<string[][]> {
        const longitude = parseFloat(location.longitude.toString());
        const latitude = parseFloat(location.latitude.toString());
        const radiusKm = parseFloat(radius.toString());

        if (isNaN(longitude) || isNaN(latitude) || isNaN(radiusKm)) {
            throw new Error('Invalid coordinates or radius');
        }
        const nearbyDrivers = await locationService.findNearbyDrivers(longitude, latitude, radiusKm);
        return nearbyDrivers;
    };

    async assignDriver(bookingId: string, driverId: string) {
        const booking = await this.bookingRepository.updateBookingStatus(bookingId as unknown as mongoose.Schema.Types.ObjectId, driverId as unknown as mongoose.Schema.Types.ObjectId, 'confirmed');
        if (!booking) throw new Error('Booking already confirmed or does not exist');
        return booking;
    };
}

export default BookingService;