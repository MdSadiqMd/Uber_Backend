import { ILocation } from "../types";
import { DriverRepository } from "../repositories";
import { locationService } from "./location.service";
import { logger } from "../config";

class DriverService {
    private driverRepository: DriverRepository;

    constructor() {
        this.driverRepository = new DriverRepository();
    }

    async updateLocation(driverId: string, location: ILocation): Promise<void> {
        const { latitude, longitude } = location;
        const lat = parseFloat(latitude.toString());
        const lon = parseFloat(longitude.toString());
        if (isNaN(lat) || isNaN(lon)) {
            throw new Error('Invalid coordinates');
        }
        logger.info(`Adding to Redis: ${lon.toString()} ${lat.toString()} ${driverId}`);

        try {
            const res = await locationService.addDriverLocation(driverId, lat, lon);
            logger.info(`Updated Driver Location to Service: ${res}`);
        } catch (error) {
            logger.info(`Error in Updating Location in Redis: ${error}`);
        }

        await this.driverRepository.updateDriverLocation(driverId, {
            latitude: lat,
            longitude: lon
        } as ILocation);
    };

    async getDriverBookings(driverId: string): Promise<any> {
        const driverBookings = await this.driverRepository.findDriverById(driverId);
        return driverBookings;
    };
}

export default DriverService;