import mongoose from "mongoose";

import { User } from "../models";
import { IUser, ILocation } from "../types";

class DriverRepository {
    async findDriverById(driverId: mongoose.Schema.Types.ObjectId | string): Promise<IUser | null> {
        return User.findOne({ _id: driverId, role: 'driver' }).exec();
    };

    async updateDriverLocation(driverId: mongoose.Schema.Types.ObjectId | string, location: ILocation): Promise<IUser | null> {
        return User.findByIdAndUpdate(driverId, { location }, { new: true }).exec();
    };
}

export default DriverRepository;