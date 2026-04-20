export type ProductCategory = "Motorcycles" | "Parts" | "Accessories";

export interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  total_sales_eth: number;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  brand_id: string | null;
  brand?: Brand;
  price: number;
  cashback_amount: number;
  description: string | null;
  image_url: string | null;
  rating: number;
  featured: boolean;
  created_at: string;
}

export interface FeaturedListing {
  id: string;
  product_id: string;
  product?: Product;
  auction_end_time: string;
  color_theme: "green" | "red" | "yellow";
  is_active: boolean;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  rating_as_renter: number;
  rating_as_owner: number;
  is_verified: boolean;
  social_discord: string | null;
  social_meta: string | null;
  social_youtube: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price_at_purchase: number;
}

export type FilterSort = "price_asc" | "price_desc" | "newest" | "popular";

export interface MarketplaceFilters {
  category: ProductCategory | "All";
  brand: string;
  priceMin: number;
  priceMax: number;
  sort: FilterSort;
  accessoryTypes: string[];
  search: string;
}
