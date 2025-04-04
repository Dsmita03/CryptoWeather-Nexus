import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../store/themeSlice";
import websocketReducer from "./websocketSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    websocket: websocketReducer,
  },
});

export default store;
