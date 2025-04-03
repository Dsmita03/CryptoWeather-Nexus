import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWeatherData } from "../store/weatherSlice";
import { RootState, AppDispatch } from "../store/store";

const useWeather = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Use `useSelector` once to optimize re-renders
  const { data: weather, status, alerts } = useSelector((state: RootState) => state.weather);

  useEffect(() => {
    if (!weather || Object.keys(weather).length === 0) {
      dispatch(getWeatherData());
    }
  }, [dispatch, weather]);

  return { weather, status, alerts };
};

export default useWeather;
