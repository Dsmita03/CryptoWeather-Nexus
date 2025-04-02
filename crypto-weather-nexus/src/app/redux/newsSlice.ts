// redux/newsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://newsdata.io/api/1/news";
const API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;

interface NewsState {
  data: any;
  status: "idle" | "loading" | "failed";
}

const initialState: NewsState = {
  data: null,
  status: "idle",
};

export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  const response = await axios.get(`${API_URL}?apikey=${API_KEY}&category=crypto`);
  return response.data;
});

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(fetchNews.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default newsSlice.reducer;
