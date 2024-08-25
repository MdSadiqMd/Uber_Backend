import { Document } from 'mongoose';

export interface ILocation extends Document {
    latitude: number;
    longitude: number;
}