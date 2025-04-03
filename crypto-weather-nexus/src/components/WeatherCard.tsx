import Link from "next/link";

interface WeatherCardProps {
  city: string;
  weather?: {
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    condition?: string;
  };
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, weather }) => {
  return (
    <Link href={`/weather/${city.toLowerCase()}`} className="no-underline">
      <div className="bg-gradient-to-r from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 shadow-md rounded-xl p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-lg">
        
        {/* 🌆 City Name */}
        <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase">{city}</h2>

        {/* 🌡 Live Temperature */}
        <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-300 mt-2">
          {weather?.temperature !== undefined ? `${weather.temperature}°C` : "N/A"}
        </p>

        {/* 📊 Weather Stats (Flexbox for Alignment) */}
        <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-400 text-sm">
          <p>
            💧 <span className="font-medium">Humidity:</span> <span className="font-semibold">{weather?.humidity ?? "N/A"}%</span>
          </p>
          <p>
            🌬 <span className="font-medium">Wind:</span> <span className="font-semibold">{weather?.windSpeed ?? "N/A"} km/h</span>
          </p>
          <p>
            ⛅ <span className="font-medium">Condition:</span> <span className="font-semibold">{weather?.condition ?? "Unknown"}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default WeatherCard;
