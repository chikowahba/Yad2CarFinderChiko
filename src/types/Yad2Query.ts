import { Yad2Listing } from "./Yad2Listing";

export interface Yad2Query {
    queryKey?: string[];
    state?: {
      data?: {
        private?: Yad2Listing[];
        commercial?: Yad2Listing[];
      }
    }
  }