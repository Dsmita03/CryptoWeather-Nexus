import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure for each live price entry
interface LivePrice {
  price: number;
  usd: number;
  change24h?: number;
}

// Define the structure of the WebSocket slice state
interface WebSocketState {
  livePrices: Record<string, LivePrice>; // e.g., { bitcoin: { price: ..., usd: ..., change24h: ... } }
}

// Initial state for the WebSocket slice
const initialState: WebSocketState = {
  livePrices: {},
};

// Create the slice
const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    updatePrice: (
      state,
      action: PayloadAction<{ id: string; price: number; usd: number; change24h?: number }>
    ) => {
      const { id, price, usd, change24h } = action.payload;

      const existing = state.livePrices[id];

      // Only update if there's a real change to prevent re-renders
      if (
        !existing ||
        existing.price !== price ||
        existing.usd !== usd ||
        existing.change24h !== change24h
      ) {
        state.livePrices[id] = {
          price,
          usd,
          change24h: change24h ?? existing?.change24h,
        };
      }
    },
  },
});

// Export actions and reducer
export const { updatePrice } = websocketSlice.actions;
export default websocketSlice.reducer;
