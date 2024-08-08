import mongoose, { Document } from "mongoose";

export interface IBooking extends Document {
    passenger: mongoose.Schema.Types.ObjectId;
    driver: mongoose.Schema.Types.ObjectId | null;
    source: {
        latitude: number;
        longitude: number;
    };
    destination: {
        latitude: number;
        longitude: number;
    };
    fare: number;
    status: 'pending' | 'confirmed' | 'completed';
    rating: number;
    feedback: string;
}