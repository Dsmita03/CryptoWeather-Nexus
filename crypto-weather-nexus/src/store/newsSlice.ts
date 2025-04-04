import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchCryptoNews } from "../services/api";

// Define the shape of a NewsArticle
interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: { name: string };
  urlToImage?: string;
}

// Response from the API
interface NewsResponse {
  results: NewsArticle[];
}

// NewsState shape
interface NewsState {
  articles: NewsArticle[];
  status: "idle" | "loading" | "failed";
  error: string | null;
  loading: boolean;
}

const initialState: NewsState = {
  articles: [],
  status: "idle",
  error: null,
  loading: false,
};

// Async thunk to fetch news data
export const getNewsData = createAsyncThunk("news/getNews", async () => {
  const news = await fetchCryptoNews();
  return (news as NewsResponse).results || [];  // Ensure you're returning 'results'
});

// Create the slice
const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNewsData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNewsData.fulfilled, (state, action: PayloadAction<NewsArticle[]>) => {
        state.status = "idle";
        state.articles = action.payload;
      })
      .addCase(getNewsData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error fetching news";
      });
  },
});


export default newsSlice.reducer;
