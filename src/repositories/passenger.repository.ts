import mongoose from 'mongoose';

import { User } from '../models';
import { IUser } from '../types';

class PassengerRepository {
    async(passengerId: mongoose.Schema.Types.ObjectId): Promise<IUser | null> {
        return User.findOne({ _id: passengerId, role: 'passenger' }).exec();
    };
}

export default PassengerRepository;