import { useEffect } from "react";
import { fetchTemperature, WeatherData } from "@/services/api";
import { toast } from "sonner";

const tempThreshold = 5;

export const useWeatherAlerts = (cities: string[]) => {
  useEffect(() => {
    const previousTemps: Record<string, number | null> = {};

    const checkWeather = async () => {
      for (const city of cities) {
        try {
          const weather: WeatherData = await fetchTemperature(city);
          const currentTemp = weather.temperature;

          if (
            previousTemps[city] !== undefined &&
            previousTemps[city] !== null &&
            Math.abs(currentTemp - previousTemps[city]!) >= tempThreshold
          ) {
            toast.warning(
              `🌡️ Sudden temperature change in ${city}! Now: ${currentTemp.toFixed(1)}°C`,
              {
                description: `Condition: ${weather.condition} | Wind: ${weather.windSpeed} m/s`,
              }
            );
          }

          previousTemps[city] = currentTemp;
        } catch (error) {
          console.error(`Weather check failed for ${city}`, error);
        }
      }
    };

    checkWeather(); // Initial check
    const interval = setInterval(checkWeather, 15000);

    return () => clearInterval(interval);
  }, [cities]);
};
