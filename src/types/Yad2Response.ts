import { Yad2Listing } from "./Yad2Listing";

export interface Yad2Response {
    pageProps?: {
      dehydratedState?: {
        queries?: Array<{
          queryKey?: string[];
          state?: {
            data?: {
              private?: Yad2Listing[];
              commercial?: Yad2Listing[];
            }
          }
        }>
      }
    }
  }