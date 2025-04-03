import TelegramBotAPI from 'node-telegram-bot-api';
import { Yad2Listing } from '../types/Yad2Listing';

export class TelegramBot {
    private bot: TelegramBotAPI;
    private chatId: string;

    constructor(token: string, chatId: string) {
        this.bot = new TelegramBotAPI(token, { polling: false });
        this.chatId = chatId;
    }

    /**
     * Send alert for a new car listing
     */
    public async sendAlert(listing: Yad2Listing): Promise<void> {
        try {
            // Create a simple message with just the token
            const message = `🚨 NEW CAR ALERT 🚨\n\n` +
                `Link: https://www.yad2.co.il/vehicles/item/${listing.token}\n` +
                `${listing.manufacturer?.textEng || "Unknown Manufacturer"} ${listing.model?.textEng || "Unknown model"} ${listing.vehicleDates?.yearOfProduction || "Unknown year"}\n` +
                `Hand: ${listing.hand?.text || "Unknown"} ${listing.owner?.text || "Unknown"} ${listing.previousOwner ? listing.previousOwner.text : ''}\n` +
                `Kilometer: ${listing.km}` + 
                `Price: ${listing.price || 'N/A'} ₪\n` +
                `City: ${listing.address?.city?.text || "Unknown"}\n` +
                `Phone: ${listing.customer?.phone || 'N/A'} ${listing.customer?.name}\n`;

            if (listing.metaData?.coverImage) {
                await this.bot.sendPhoto(this.chatId, listing.metaData!.coverImage, { caption: message },)
            }
            else {
                await this.bot.sendMessage(this.chatId, message);
            }
            console.log(`Alert sent for car with token: ${listing.token}`);
        } catch (error) {
            console.error('Error sending Telegram alert:', error);
        }
    }

    /**
     * Send a simple text message
     */
    public async sendMessage(message: string): Promise<void> {
        try {
            await this.bot.sendMessage(this.chatId, message);
        } catch (error) {
            console.error('Error sending Telegram message:', error);
        }
    }
}
