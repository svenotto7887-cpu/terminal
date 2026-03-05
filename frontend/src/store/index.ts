import { configureStore } from '@reduxjs/toolkit';
import marketReducer from './slices/marketSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    market: marketReducer,
    order: orderReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// typed hooks
export const useAppDispatch = () => store.dispatch as AppDispatch;
export const useAppSelector = <T>(selector: (state: RootState) => T) => selector(store.getState());
