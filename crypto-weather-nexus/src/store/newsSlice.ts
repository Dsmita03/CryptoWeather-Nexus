import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchCryptoNews } from "../services/api";

// Define types for the News state
interface NewsState {
  articles: Array<{ title: string; link: string; source: { name: string } }>;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

// Initial state of the news slice
const initialState: NewsState = {
  articles: [],
  status: "idle",
  error: null,
};

// Async thunk to fetch crypto news data
export const getNewsData = createAsyncThunk("news/getNews", async () => {
  return await fetchCryptoNews(); // Fetch crypto news from the API
});

// Create the news slice
const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNewsData.pending, (state) => {
        state.status = "loading"; // Set status to loading when the request is pending
      })
      .addCase(getNewsData.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "idle"; // Set status to idle when the data is successfully fetched
        state.articles = action.payload; // Store the fetched articles in the state
      })
      .addCase(getNewsData.rejected, (state, action) => {
        state.status = "failed"; // Set status to failed if the request fails
        state.error = action.error.message || "Error fetching news"; // Store the error message if the request fails
      });
  },
});

export default newsSlice.reducer;
