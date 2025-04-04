// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';
import websocketReducer from './websocketSlice';
import newsReducer from './newsSlice';

// Create the Redux store
export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    websocket: websocketReducer,
    news: newsReducer,
  },
});

// RootState type - used to access the entire Redux state structure
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch type - used for dispatching actions in a type-safe way
export type AppDispatch = typeof store.dispatch;
