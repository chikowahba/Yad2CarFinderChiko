import { MongoManager } from './services/MongoManager';
import { Yad2Fetcher } from './services/Yad2Fetcher';
import { TelegramBot } from './services/TelegramBot';
import { Yad2Listing } from './types/Yad2Listing';

export class App {
    private mongoManager: MongoManager;
    private yad2Fetcher: Yad2Fetcher;
    private telegramBot: TelegramBot;

    constructor(
        mongoUri: string,
        telegramToken: string,
        telegramChatId: string,
        searchParams: Record<string, string>,
        yad2BaseUrl: string
    ) {
        this.mongoManager = new MongoManager(mongoUri);
        this.yad2Fetcher = new Yad2Fetcher(yad2BaseUrl, searchParams);
        this.telegramBot = new TelegramBot(telegramToken, telegramChatId);
    }

    /**
     * Initialize the application
     */
    public async init(): Promise<void> {
        try {
            await this.mongoManager.connect();
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            throw error;
        }
    }

    /**
     * Run a single check of Yad2 listings
     */
    public async run(): Promise<void> {
        try {
            console.log('Starting single Yad2 check...');
            
            // Run a single check
            await this.checkForNewListings();
            
            // Shut down cleanly
            await this.shutdown();
            
            console.log('Check completed successfully');
        } catch (error) {
            console.error('Error during Yad2 check:', error);
            await this.telegramBot.sendMessage("Error checking Yad2");
            await this.shutdown();
            process.exit(1);
        }
    }

    /**
     * Shutdown the application
     */
    public async shutdown(): Promise<void> {
        await this.mongoManager.disconnect();
        console.log('App shutdown complete');
    }

    /**
     * Check for new listings
     */
    private async checkForNewListings(): Promise<void> {
        try {
            console.log('Checking for new listings...');

            // Fetch current listings
            const listings = await this.yad2Fetcher.fetchListings();
            console.log(`Found ${listings.length} listings`);

            // Process each listing
            let newListingsCount = 0;
            for (const listing of listings) {
                const exists = await this.mongoManager.tokenExists(listing.token);

                if (!exists) {
                    // New listing found - save to database and send alert
                    console.log(`NEW LISTING FOUND with token: ${listing.token}`);
                    await this.mongoManager.saveToken(listing.token);
                    await this.telegramBot.sendAlert(listing);
                    newListingsCount++;
                }
            }

            console.log(`Found ${newListingsCount} new listings out of ${listings.length} total`);
            console.log('Finished checking for new listings');
        } catch (error) {
            console.error('Error checking for new listings:', error);
            await this.telegramBot.sendMessage("Error fetching yad 2");
            throw error; // Rethrow to be caught by run()
        }
    }
}
