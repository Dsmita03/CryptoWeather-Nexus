import { useAppSelector } from "../redux/hooks";

interface WeatherProps {
  city: string;
}

export default function WeatherCard({ city }: WeatherProps) {
  const weather = useAppSelector((state) => state.weather.data);

  if (!weather) {
    return (
      <div className="flex justify-center items-center bg-white shadow-md rounded-lg p-6 animate-pulse">
        <p className="text-gray-500">Loading weather data...</p>
      </div>
    );
  }

  // Weather Icons Mapping
  const weatherIcons: Record<number, string> = {
    0: "☀️", // Clear
    1: "🌤️", // Mainly clear
    2: "⛅", // Partly cloudy
    3: "☁️", // Overcast
    45: "🌫️", // Fog
    48: "🌫️", // Depositing rime fog
    51: "🌦️", // Light drizzle
    53: "🌧️", // Moderate drizzle
    55: "🌧️", // Dense drizzle
    61: "🌧️", // Slight rain
    63: "🌧️", // Moderate rain
    65: "🌧️", // Heavy rain
    71: "❄️", // Slight snow
    73: "❄️", // Moderate snow
    75: "❄️", // Heavy snow
    95: "⛈️", // Thunderstorm
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-indigo-600 shadow-xl rounded-lg p-6 text-white transform transition-all hover:scale-105 hover:shadow-2xl">
      {/* Weather Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{city}</h2>
        <span className="text-4xl">{weatherIcons[weather.current_weather?.weathercode] || "🌍"}</span>
      </div>

      {/* Weather Details */}
      <div className="mt-4 space-y-2">
        <p className="text-lg">🌡️ Temperature: <span className="font-semibold">{weather.current_weather?.temperature ?? "N/A"}°C</span></p>
        <p className="text-lg">💧 Humidity: <span className="font-semibold">{weather.current_weather?.humidity ?? "N/A"}%</span></p>
        <p className="text-lg">☁️ Condition: <span className="font-semibold">{weather.current_weather?.weathercode ?? "N/A"}</span></p>
      </div>

      {/* Footer Section */}
      <div className="mt-4 flex justify-between items-center">
        <a
          href={`https://www.weather.com/weather/today/l/${city}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold shadow-md hover:bg-gray-100 transition"
        >
          View Details
        </a>
        <span className="text-sm bg-black/30 px-3 py-1 rounded-md">
          Powered by Open-Meteo
        </span>
      </div>
    </div>
  );
}
