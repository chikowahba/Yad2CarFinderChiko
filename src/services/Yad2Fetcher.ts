import axios, { AxiosResponse } from 'axios';
import { Yad2Listing, Yad2Response } from '../types/Yad2Types';

export class Yad2Fetcher {
  private baseUrl: string;
  private searchParams: Record<string, string>;

  constructor(
    baseUrl: string = 'https://www.yad2.co.il/vehicles/_next/data/5Cpe1oVmUlhLAt3wCLuoo/cars.json',
    searchParams: Record<string, string> = {}
  ) {
    this.baseUrl = baseUrl;
    this.searchParams = searchParams;
  }

  /**
   * Set search parameters for Yad2 query
   */
  public setSearchParams(params: Record<string, string>): void {
    this.searchParams = params;
  }

  /**
   * Fetch car listings from Yad2
   */
  public async fetchListings(): Promise<Yad2Listing[]> {
    try {
      const response: AxiosResponse<Yad2Response> = await axios.get(this.baseUrl, {
        params: this.searchParams,
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9,he-IL;q=0.8,he;q=0.7',
          'Connection': 'keep-alive',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      return this.extractListings(response.data);
    } catch (error) {
      console.error('Error fetching data from Yad2:', error);
      return [];
    }
  }

  /**
   * Extract car listings from Yad2 response
   */
  private extractListings(data: Yad2Response): Yad2Listing[] {
    try {
      // Find the query result containing car listings
      const feedData = data.pageProps?.dehydratedState?.queries?.find(query => 
        query.queryKey && query.queryKey[0] === 'feed' && query.queryKey[1] === 'vehicles'
      );

      if (!feedData?.state?.data) {
        console.log('No feed data found');
        return [];
      }

      // Extract and combine private and commercial listings
      const privateListings = feedData.state.data.private || [];
      const commercialListings = feedData.state.data.commercial || [];
      
      return [...privateListings, ...commercialListings];
    } catch (error) {
      console.error('Error extracting listings:', error);
      return [];
    }
  }
}