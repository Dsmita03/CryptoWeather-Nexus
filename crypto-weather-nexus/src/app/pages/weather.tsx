"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCloud, FaSun, FaCloudRain, FaSnowflake, FaBolt } from "react-icons/fa";
import WeatherCard from "../components/WeatherCard";

const cities = [
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Beijing", lat: 39.9042, lon: 116.4074 },
  { name: "Kathmandu", lat: 27.7172, lon: 85.324 },
];

type WeatherData = {
  city: string;
  temperature: string;
  condition: string;
  icon: JSX.Element;
};

const weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const responses = await Promise.all(
          cities.map(async ({ name, lat, lon }) => {
            const res = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
            );

            const temp = res.data.main.temp;
            const weatherMain = res.data.weather[0].main;

            let condition = weatherMain;
            let icon = <FaSun className="text-yellow-500 text-2xl" />;

            if (weatherMain === "Snow") {
              condition = "Snowy";
              icon = <FaSnowflake className="text-blue-400 text-2xl" />;
            } else if (weatherMain === "Clouds") {
              condition = "Cloudy";
              icon = <FaCloud className="text-gray-500 text-2xl" />;
            } else if (weatherMain === "Rain" || weatherMain === "Drizzle") {
              condition = "Rainy";
              icon = <FaCloudRain className="text-blue-600 text-2xl" />;
            } else if (weatherMain === "Thunderstorm") {
              condition = "Stormy";
              icon = <FaBolt className="text-yellow-600 text-2xl" />;
            }

            return {
              city: name,
              temperature: `${temp}°C`,
              condition,
              icon,
            };
          })
        );

        setWeatherData(responses);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        🌤️ Weather Details
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 text-lg font-medium">
          Fetching latest weather data...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {weatherData.map((weather, index) => (
            <WeatherCard
              key={index}
              city={weather.city}
              // temperature={weather.temperature}
              // condition={weather.condition}
              // icon={weather.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default weather;
