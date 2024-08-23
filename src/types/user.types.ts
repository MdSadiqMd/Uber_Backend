import { Document } from 'mongoose';

export interface IUser extends Document {
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