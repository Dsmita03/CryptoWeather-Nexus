import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure for live prices, including optional change24h
interface LivePrice {
  price: number;
  change24h?: number;
}

interface WebSocketState {
  livePrices: Record<string, LivePrice>; // Stores price & 24h change
}

const initialState: WebSocketState = {
  livePrices: {},
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    updatePrice: (
      state,
      action: PayloadAction<{ id: string; price: number; change24h?: number }>
    ) => {
      const { id, price, change24h } = action.payload;
      
      // Update the price and 24h change
      state.livePrices[id] = {
        price,
        change24h: change24h ?? state.livePrices[id]?.change24h, // Preserve existing 24h change if not provided
      };
    },
  },
});

export const { updatePrice } = websocketSlice.actions;
export default websocketSlice.reducer;
