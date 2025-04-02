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

// Create app instance with the necessary parameters
// Removed the polling interval as it's not needed for cron job approach
const app = new App(
  MONGODB_URI,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
  searchParams,
  YAD2_BASE_URL
);

// Handle graceful shutdown
const handleShutdown = async () => {
  console.log('Received shutdown signal');
  await app.shutdown();
  process.exit(0);
};

// Set up signal handlers
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Run the application once and exit
(async () => {
  try {
    console.log('Starting Yad2 check (cron job mode)...');
    await app.init();
    
    // Run a single check instead of starting the interval polling
    await app.run();
    
    console.log('Yad2 check completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to run application:', error);
    process.exit(1);
  }
})();
