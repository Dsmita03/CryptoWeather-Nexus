import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCryptoPrices } from "../services/api";

export const getCryptoData = createAsyncThunk("crypto/getData", async () => {
  return await fetchCryptoPrices();
});

const cryptoSlice = createSlice({
  name: "crypto",
  initialState: { data: {}, loading: false, error: null },
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
        state.error = action.error.message;
      });
  },
});

export default cryptoSlice.reducer;
