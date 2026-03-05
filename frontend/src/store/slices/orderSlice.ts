import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
  pendingOrders: any[];
  filledOrders: any[];
  loading: boolean;
}

const initialState: OrderState = {
  pendingOrders: [],
  filledOrders: [],
  loading: false
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setPendingOrders(state, action: PayloadAction<any[]>) {
      state.pendingOrders = action.payload;
    },
    setFilledOrders(state, action: PayloadAction<any[]>) {
      state.filledOrders = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    addOrder(state, action: PayloadAction<any>) {
      if (action.payload.status === 'pending') {
        state.pendingOrders.push(action.payload);
      } else if (action.payload.status === 'filled') {
        state.filledOrders.push(action.payload);
      }
    }
  }
});

export const { setPendingOrders, setFilledOrders, setLoading, addOrder } = orderSlice.actions;
export default orderSlice.reducer;
