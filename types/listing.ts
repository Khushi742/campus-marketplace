export type ListingStatus = "ACTIVE" | "SOLD";

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  imageUrls: string[];
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  sellerId: string;
  seller?: { id: string; name: string; email?: string; campus?: string | null; avatar?: string | null };
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  campus?: string | null;
  avatar?: string | null;
  phone?: string | null;
};
