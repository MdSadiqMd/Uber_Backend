import mongoose, { Document } from "mongoose";

import { ILocation } from "./location.types";

export interface IBooking extends Document {
    passenger: mongoose.Schema.Types.ObjectId;
    driver: mongoose.Schema.Types.ObjectId | null;
    source: ILocation;
    destination: ILocation;
    fare: number;
    status: 'pending' | 'confirmed' | 'completed';
    rating: number;
    feedback: string;
}