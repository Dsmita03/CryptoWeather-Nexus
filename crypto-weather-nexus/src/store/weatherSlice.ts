import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchWeather } from "../services/api";

interface WeatherState {
  data: Record<string, any>;
  status: "idle" | "loading" | "failed";
  alerts: Record<string, string>; // ✅ Fix: Added alerts
}

const initialState: WeatherState = {
  data: {},
  status: "idle",
  alerts: {}, // ✅ Fix: Ensure alerts are part of the state
};

// ✅ Thunk to fetch weather dynamically
export const getWeatherData = createAsyncThunk("weather/getWeather", async () => {
  return await fetchWeather();
});

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    // ✅ Action to update weather alerts dynamically
    updateWeatherAlert: (state, action: PayloadAction<{ city: string; alert: string }>) => {
      state.alerts[action.payload.city] = action.payload.alert;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWeatherData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getWeatherData.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(getWeatherData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { updateWeatherAlert } = weatherSlice.actions; // ✅ Export alert action
export default weatherSlice.reducer;
