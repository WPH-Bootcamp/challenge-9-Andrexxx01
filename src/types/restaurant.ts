export interface Restaurant {
  id: number;
  name: string;
  star: number;
  place: string;
  distance?: number;
  logo: string;
  images?: string[];
  category?: string;
  revieewCount?: number;
  menuCount?: number;
  priceRange?: {
    min: number;
    max: number;
  };        
}

export interface RecommendedResponse {
  success: boolean;
  data: {
    recommendations: Restaurant[];
  };
}

export interface BestSellerResponse {
  success: boolean;
  data: {
    restaurants: Restaurant[];
  };
}

export type Category =
  | "recommended"
  | "nearby"
  | "discount"
  | "best"
  | "delivery"
  | "lunch";
