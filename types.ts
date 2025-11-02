// Fix: Provide type definitions to resolve module errors.
export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags?: string[];
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface User {
  name: string;
  email: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
