import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    [x: string]: any;
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: 'driver' | 'passenger';
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    comparePassword(candidatePassword: string): Promise<boolean>;
}