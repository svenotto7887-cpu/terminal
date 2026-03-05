export type OrderSide = 'buy' | 'sell';
export type OrderType = 'limit' | 'market' | 'stop';

export interface Order {
  id: string;
  pair: string;           // e.g. "SEI/USDC"
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;         // limit / stop price
  status: 'pending' | 'filled' | 'canceled';
  createdAt: string;      // ISO
  filledAt?: string;
  filledPrice?: string;
}
