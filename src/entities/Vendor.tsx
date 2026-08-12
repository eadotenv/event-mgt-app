export interface Vendor {
  id: string;
  name: string;
  category: string;
  rate: number;
  location: string;
  rating: number;
  image: string;
  description: string;
}

export interface BookedVendor {
  vendorId: string;
  name: string;
  category: string;
  rate: number;
  location: string;
  rating: number;
  image: string;
  status: "pending" | "confirmed" | "cancelled";
}
