export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_gifted: boolean;
  created_at?: string;
}

export interface CartItem extends Product {
  specialNote?: string;
}

export interface Order {
  id: number;
  user_name: string;
  total_price: number;
  special_note?: string | null;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  price_at_time: number;
  created_at: string;
}