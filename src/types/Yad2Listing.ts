export interface Yad2Listing {
    token: string;
    price?: number;
    previousOwner?: { text: string };
    owner?: { text: string };
    customer?: { name: string, phone: string };
    hand?: { text: string };
    vehicleDates?: { yearOfProduction: number };
    model?: { textEng: string };
    manufacturer: { textEng: string };
    metaData: { coverImage: string };
    // We'll keep it minimal as requested - more fields can be added later
  }