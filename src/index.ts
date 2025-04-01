import dotenv from 'dotenv';
import { App } from './App';
import process from 'process';

// Load environment variables
dotenv.config();

// Get environment variables
const {
  MONGODB_URI,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
  POLLING_INTERVAL_MS,
  YAD2_MANUFACTURER,
  YAD2_MODEL,
  YAD2_YEAR,
  YAD2_PRICE,
  YAD2_KM,
  YAD2_ENGINE_VAL,
  YAD2_HAND,
  YAD2_TOP_AREA,
  YAD2_AREA,
  YAD2_GEAR_BOX,
  YAD2_PRICE_ONLY,
  YAD2_IMG_ONLY,
  YAD2_OWNER_ID,
  YAD2_BASE_URL
} = process.env;

// Validate required environment variables
if (!MONGODB_URI || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || !YAD2_BASE_URL) {
  console.error('Missing required environment variables. Please check your .env file');
  process.exit(1);
}

// Create Yad2 search parameters
const searchParams: Record<string, string> = {
  manufacturer: YAD2_MANUFACTURER!,
  model: YAD2_MODEL!,
  year: YAD2_YEAR!,
  price: YAD2_PRICE!,
  km: YAD2_KM!,
  engineval: YAD2_ENGINE_VAL!,
  hand: YAD2_HAND!,
  topArea: YAD2_TOP_AREA!,
  area: YAD2_AREA!,
  gearBox: YAD2_GEAR_BOX!,
  priceOnly: YAD2_PRICE_ONLY!,
  imgOnly: YAD2_IMG_ONLY!,
  ownerID: YAD2_OWNER_ID!
};

// Create app instance
const app = new App(
  MONGODB_URI,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
  searchParams,
  parseInt(POLLING_INTERVAL_MS || '120000'),
  YAD2_BASE_URL
);

// Handle graceful shutdown
const handleShutdown = async () => {
  console.log('Received shutdown signal');
  await app.shutdown();
  process.exit(1);
};

// Set up signal handlers
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Start the application
(async () => {
  try {
    await app.init();
    app.start();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
})();
