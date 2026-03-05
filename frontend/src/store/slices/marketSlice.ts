import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PriceUpdate {
  pair: string;
  price: string;
}

interface OrderUpdate {
  id: string;
  status: string;
  // … other fields from Order model
}

interface MarketState {
  prices: Record<string, string>;
  orders: Record<string, any>;
}

const initialState: MarketState = {
  prices: {},
  orders: {}
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    priceUpdate(state, action: PayloadAction<PriceUpdate>) {
      state.prices[action.payload.pair] = action.payload.price;
    },
    orderUpdate(state, action: PayloadAction<OrderUpdate>) {
      state.orders[action.payload.id] = action.payload;
    }
  }
});

export const { priceUpdate, orderUpdate } = marketSlice.actions;
export default marketSlice.reducer;
