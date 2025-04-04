import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCryptoPrices } from "../services/api";

export const getCryptoData = createAsyncThunk("crypto/getData", async () => {
  return await fetchCryptoPrices();
});

const cryptoSlice = createSlice({
  name: "crypto",
  initialState: { data: {}, loading: false, error: null as string | null }, // Update the type to allow string | null
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCryptoData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCryptoData.rejected, (state, action) => {
        state.loading = false;
        // Ensure `state.error` is a string or null
        state.error = action.error.message || null; // Fallback to null if the message is undefined
      });
  },
});

export default cryptoSlice.reducer;

 
