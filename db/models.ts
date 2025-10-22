export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  stock: number;
  features?: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
  createdAt?: string;
  password?: string;
  cart?: CartItem[];
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: string;
  orderDate: string;
  status: string;
}
