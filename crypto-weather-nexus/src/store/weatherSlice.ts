import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchWeather } from "../services/api";

// Define the shape of weather data for a single city
interface CityWeather {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

// Define the overall Redux state for weather
interface WeatherState {
  data: Record<string, CityWeather>;  // Weather info per city
  status: "idle" | "loading" | "failed";
  alerts: Record<string, string>;     // Weather alerts per city
}

// Initial state
const initialState: WeatherState = {
  data: {},
  status: "idle",
  alerts: {},
};

// Async thunk to fetch weather from API
export const getWeatherData = createAsyncThunk("weather/getWeather", async () => {
  const response = await fetchWeather();
  return response;
});

// Create slice
const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    // Action to update city-specific weather alert
    updateWeatherAlert: (state, action: PayloadAction<{ city: string; alert: string }>) => {
      const { city, alert } = action.payload;
      state.alerts[city] = alert;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWeatherData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getWeatherData.fulfilled, (state, action: PayloadAction<Record<string, CityWeather>>) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(getWeatherData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { updateWeatherAlert } = weatherSlice.actions;
export default weatherSlice.reducer;
