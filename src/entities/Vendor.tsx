export interface Vendor {
  id: string;
  name: string;
  owner: string;
  category: string;
  rate: number;
  location: string;
  rating: number;
  image: string;
  images?: string[];
  description: string;
}

export interface BookedVendor {
  vendorId: string;
  name: string;
  owner: string;
  category: string;
  rate: number;
  location: string;
  rating: number;
  image: string;
}
