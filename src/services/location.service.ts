import { ObjectId } from "mongoose";

import { redisClient } from "../config/redis.config";
import { RedisClientType } from "redis";

class LocationService {
    private redisClient: RedisClientType<any>;

    constructor(redisClient: RedisClientType<any>) {
        this.redisClient = redisClient;
    }

    async setDriverSocket(driverId: ObjectId, socketId: string): Promise<void> {
        await this.redisClient.set(`driver:${driverId}`, socketId);
    }

    async getDriverSocket(driverId: string): Promise<string | null> {
        return await this.redisClient.get(`driver:${driverId}`);
    }

    async deleteDriverSocket(driverId: string): Promise<void> {
        await this.redisClient.del(`driver:${driverId}`);
    }

    async findNearbyDrivers(longitude: number, latitude: number, radiusKm: number): Promise<string[][]> {
        const nearbyDrivers = await this.redisClient.sendCommand([
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
            await this.redisClient.sendCommand([
                'GEOADD',
                'drivers',
                latitude.toString(),
                longitude.toString(),
                driverId,
            ]);
        } catch (error) {
            console.log('Cannot add to redis', error);
        }
    }

    async removeDriverLocation(driverId: string): Promise<void> {
        await this.redisClient.sendCommand(['ZREM', 'drivers', driverId]);
    }

    async storeNotifiedDrivers(bookingId: string, driverIds: string[]): Promise<void> {
        for (const driverId of driverIds) {
            const addedCount = await this.redisClient.sAdd(`notifiedDrivers:${bookingId}`, driverId);
            console.log(`Added driver ${driverId} to the set for booking ${bookingId}, result: ${addedCount}`);
        }
    }

    async getNotifiedDrivers(bookingId: string): Promise<string[]> {
        const nearbyDrivers = await this.redisClient.sMembers(`notifiedDrivers:${bookingId}`);
        return nearbyDrivers;
    }
}

export const locationService = new LocationService(redisClient as RedisClientType<any>);