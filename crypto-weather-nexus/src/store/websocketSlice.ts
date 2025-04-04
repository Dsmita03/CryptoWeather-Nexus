import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure for live prices, including optional change24h
interface LivePrice {
  price: number;
  change24h?: number;
  usd: number; // Ensure that 'usd' is a part of the LivePrice structure
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
      action: PayloadAction<{ id: string; price: number; change24h?: number; usd: number }>
    ) => {
      const { id, price, change24h, usd } = action.payload;

      // Update the price, change24h, and usd for the corresponding id
      state.livePrices[id] = {
        price,
        change24h: change24h ?? state.livePrices[id]?.change24h, // Preserve existing 24h change if not provided
        usd,
      };
    },
  },
});

export const { updatePrice } = websocketSlice.actions;
export default websocketSlice.reducer;
