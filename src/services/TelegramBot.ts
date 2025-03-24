import TelegramBotAPI from 'node-telegram-bot-api';
import { Yad2Listing } from '../types/Yad2Types';

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
        `Token: ${listing.token}\n` +
        `Price: ${listing.price || 'N/A'} ₪\n`;

      await this.bot.sendMessage(this.chatId, message);
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