import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define the type for weather data
interface WeatherData {
  current_weather: {
    temperature: number;
    humidity: number;
    weathercode: number;
  };
}

// Define the initial state type
interface WeatherState {
  data: WeatherData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Define initial state
const initialState: WeatherState = {
  data: null,
  status: "idle",
  error: null,
};

// Define async thunk for fetching weather
export const fetchWeather = createAsyncThunk("weather/fetchWeather", async (city: string) => {
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current_weather=true`);
  const data = await response.json();
  return data as WeatherData;
});

// Create Redux slice
const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWeather.fulfilled, (state, action: PayloadAction<WeatherData>) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch data";
      });
  },
});

export default weatherSlice.reducer;
