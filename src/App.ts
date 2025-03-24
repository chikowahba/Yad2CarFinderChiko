import { MongoManager } from './services/MongoManager';
import { Yad2Fetcher } from './services/Yad2Fetcher';
import { TelegramBot } from './services/TelegramBot';
import { Yad2Listing } from './types/Yad2Listing';

export class App {
    private mongoManager: MongoManager;
    private yad2Fetcher: Yad2Fetcher;
    private telegramBot: TelegramBot;
    private pollingInterval: number;
    private intervalId?: NodeJS.Timeout;

    constructor(
        mongoUri: string,
        telegramToken: string,
        telegramChatId: string,
        searchParams: Record<string, string>,
        pollingInterval: number = 120000
    ) {
        this.mongoManager = new MongoManager(mongoUri);
        this.yad2Fetcher = new Yad2Fetcher(undefined, searchParams);
        this.telegramBot = new TelegramBot(telegramToken, telegramChatId);
        this.pollingInterval = pollingInterval;
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
     * Start monitoring Yad2
     */
    public start(): void {
        console.log('Starting Yad2 monitoring service...');

        // Run immediately and then set interval
        this.checkForNewListings();

        this.intervalId = setInterval(() => {
            this.checkForNewListings();
        }, this.pollingInterval);

        console.log(`Monitoring service started. Checking every ${this.pollingInterval / 1000} seconds.`);
    }

    /**
     * Stop monitoring Yad2
     */
    public stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
            console.log('Monitoring service stopped');
        }
    }

    /**
     * Shutdown the application
     */
    public async shutdown(): Promise<void> {
        this.stop();
        await this.mongoManager.disconnect();
        console.log('App shutdown complete');
    }

    /**
     * Check for new listings
     */
    private async checkForNewListings(): Promise<void> {
        try {
            console.log('Checking for new listings...');

            try {
                // Fetch current listings
                const listings = await this.yad2Fetcher.fetchListings();
                console.log(`Found ${listings.length} listings`);
            }
            catch (e) {
                this.telegramBot.sendMessage("Error fetching yad 2");
            }

            // Process each listing
            for (const listing of listings) {
                const exists = await this.mongoManager.tokenExists(listing.token);

                if (!exists) {
                    // New listing found - save to database and send alert
                    await this.mongoManager.saveToken(listing.token);
                    await this.telegramBot.sendAlert(listing);
                    console.log(`New listing found with token: ${listing.token}`);
                }
            }

            console.log('Finished checking for new listings');
        } catch (error) {
            console.error('Error checking for new listings:', error);
        }
    }
}