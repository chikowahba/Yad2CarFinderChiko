import dotenv from 'dotenv';
import { App } from './App';

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
  YAD2_OWNER_ID
} = process.env;

// Validate required environment variables
if (!MONGODB_URI || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('Missing required environment variables. Please check your .env file');
  process.exit(1);
}

// Create Yad2 search parameters
const searchParams: Record<string, string> = {
  manufacturer: YAD2_MANUFACTURER || '36',
  model: YAD2_MODEL || '10497',
  year: YAD2_YEAR || '2014-2016',
  price: YAD2_PRICE || '20000-40000',
  km: YAD2_KM || '-1-130000',
  engineval: YAD2_ENGINE_VAL || '1000-1400',
  hand: YAD2_HAND || '1-2',
  topArea: YAD2_TOP_AREA || '19,2',
  area: YAD2_AREA || '52,12',
  gearBox: YAD2_GEAR_BOX || '102',
  priceOnly: YAD2_PRICE_ONLY || '1',
  imgOnly: YAD2_IMG_ONLY || '1',
  ownerID: YAD2_OWNER_ID || '1'
};

// Create app instance
const app = new App(
  MONGODB_URI,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
  searchParams,
  parseInt(POLLING_INTERVAL_MS || '120000')
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