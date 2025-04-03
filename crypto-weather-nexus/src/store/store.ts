import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./weatherSlice";
import websocketReducer from "./websocketSlice";
import newsReducer from "./newsSlice";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    websocket: websocketReducer,
    news: newsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
