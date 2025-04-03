import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import websocketReducer from "./websocketSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    websocket: websocketReducer,
  },
});

export default store;
