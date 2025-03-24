import mongoose, { Document, Schema } from 'mongoose';

// Define a simple interface for the car ad document
export interface ICarAd extends Document {
  token: string;
  dateFound: Date;
}

// Create a schema with just the token
const carAdSchema = new Schema<ICarAd>({
  token: { 
    type: String, 
    required: true, 
    unique: true 
  },
  dateFound: { 
    type: Date, 
    default: Date.now 
  }
});

// Export the model
export const CarAd = mongoose.model<ICarAd>('CarAd', carAdSchema);