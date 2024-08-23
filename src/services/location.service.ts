import { ObjectId } from "mongoose";

import { redisClient } from "../config/redis.config";

class LocationService {
    async setDriverSocket(driverId: ObjectId, socketId: string): Promise<void> {
        await redisClient.set(`driver:${driverId}`, socketId);
    }

    async getDriverSocket(driverId: string): Promise<string | null> {
        return await redisClient.get(`driver:${driverId}`);
    }
}

export const locationService = new LocationService();