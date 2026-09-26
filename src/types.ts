export interface Persona {
  role: string;
  tagline: string;
  frustration: string;
  outcome: string;
  badge: string;
  recommendedDevice: string;
}

export interface FaqItem {
  q: string;
  a: string;
  category?: string;
}

export interface ProductModel {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  priceStartingAt: number;
  monthlyFrom: number;
  releaseDate: string;
  colors: { name: string; hex: string; ringColor: string }[];
  storageOptions: { size: string; extraPrice: number }[];
  specs: string[];
  badge?: string;
  category: 'iphone' | 'watch' | 'mac' | 'airpods';
}

export interface ReservationDetails {
  productId: string;
  storage: string;
  color: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  tradeInSelected: boolean;
  tradeInDevice?: string;
  tradeInCreditEstimate: number;
  paymentPlan: 'full' | 'monthly24' | 'monthly36';
}
