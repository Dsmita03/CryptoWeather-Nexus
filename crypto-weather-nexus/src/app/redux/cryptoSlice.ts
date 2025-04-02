import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCrypto = createAsyncThunk("crypto/fetchCrypto", async () => {
  const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
    params: { vs_currency: "usd", ids: "bitcoin,ethereum,cardano" },
  });
  return response.data;
});

const cryptoSlice = createSlice({
  name: "crypto",
  initialState: { data: [], status: "idle", error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCrypto.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCrypto.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCrypto.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch data";
      });
  },
});


export default cryptoSlice.reducer;
