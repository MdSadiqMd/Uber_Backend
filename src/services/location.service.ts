import mongoose, { ObjectId } from "mongoose";

import { redisClient } from "../config/redis.config";
import { logger } from "../config";

class LocationService {
    async setDriverSocket(driverId: ObjectId, socketId: string): Promise<void> {
        await redisClient.set(`driver:${driverId}`, socketId);
    }

    async getDriverSocket(driverId: string): Promise<string | null> {
        return await redisClient.get(`driver:${driverId}`);
    }

    async deleteDriverSocket(driverId: string): Promise<void> {
        await redisClient.del(`driver:${driverId}`);
    }

    async findNearbyDrivers(longitude: number, latitude: number, radiusKm: number): Promise<string[][]> {
        const nearbyDrivers = await redisClient.sendCommand([
            'GEORADIUS',
            'drivers',
            longitude.toString(),
            latitude.toString(),
            radiusKm.toString(),
            'km',
            'WITHCOORD',
        ]);
        return nearbyDrivers as string[][];
    }

    async addDriverLocation(driverId: string, latitude: number, longitude: number): Promise<void> {
        try {
            logger.info(`Adding Driver: ${driverId} at Latitude: ${latitude}, Longitude: ${longitude}`);
            await redisClient.sendCommand([
                'GEOADD',
                'drivers',
                longitude.toString(),
                latitude.toString(),
                driverId
            ]);
        } catch (error: any) {
            logger.error(`Error in adding Driver Location to Redis: ${error}`);
        }
    }

    async removeDriverLocation(driverId: string): Promise<void> {
        await redisClient.sendCommand(['ZREM', 'drivers', driverId]);
    }

    async storeNotifiedDrivers(bookingId: mongoose.Schema.Types.ObjectId, driverIds: string[]): Promise<void> {
        for (const driverId of driverIds) {
            const addedCount = await redisClient.sAdd(`notifiedDrivers:${bookingId}`, driverId);
            logger.info(`Added driver ${driverId} to the set for booking ${bookingId}, result: ${addedCount}`);
        }
    }

    async getNotifiedDrivers(bookingId: string): Promise<string[]> {
        const nearbyDrivers = await redisClient.sMembers(`notifiedDrivers:${bookingId}`);
        logger.info(`Nearby Drivers: ${nearbyDrivers}`);
        return nearbyDrivers;
    }
}

export const locationService = new LocationService();