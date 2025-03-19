import { ShoppingCart } from './ShoppingCart';

export interface Order {
  id: string;
  createdAt: Date;
  completedAt: Date;
  status: 'pending' | 'completed' | 'cancelled';
  shoppingCart: ShoppingCart;
}
