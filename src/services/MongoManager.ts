import mongoose from 'mongoose';
import { CarAd, ICarAd } from '../models/CarAd';

export class MongoManager {
  constructor(private uri: string) {}

  /**
   * Connect to MongoDB
   */
  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }

  /**
   * Check if a token exists in the database
   */
  public async tokenExists(token: string): Promise<boolean> {
    const count = await CarAd.countDocuments({ token });
    return count > 0;
  }

  /**
   * Save a new token to the database
   */
  public async saveToken(token: string): Promise<ICarAd> {
    const newAd = new CarAd({ token });
    return await newAd.save();
  }

  /**
   * Get all saved tokens
   */
  public async getAllTokens(): Promise<string[]> {
    const ads = await CarAd.find({}, 'token');
    return ads.map(ad => ad.token);
  }
}