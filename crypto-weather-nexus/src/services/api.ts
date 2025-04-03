import axios from "axios";

const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
const CRYPTO_API = "https://api.coingecko.com/api/v3/simple/price";
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

// Utility function to handle missing API keys
const checkApiKey = (apiKey: string | undefined, serviceName: string): void => {
  if (!apiKey) {
    console.error(`Error: ${serviceName} API key is missing.`);
    throw new Error(`${serviceName} API key is missing.`);
  }
};

// ✅ Fetch Weather Data
export const fetchWeather = async (): Promise<Record<string, WeatherData>> => {
  checkApiKey(WEATHER_API_KEY, "Weather");

  const cities = ["New York", "London", "Tokyo"];
  try {
    const weatherData = await Promise.all(
      cities.map((city) =>
        axios
          .get(`${WEATHER_API}?q=${city}&appid=${WEATHER_API_KEY}&units=metric`)
          .then((response) => {
            const { main, weather, wind } = response.data;

            // Validate the data before returning
            if (!main || !weather || !weather[0]) {
              throw new Error(`Invalid weather data received for ${city}`);
            }

            return {
              city,
              temperature: main.temp || 0,
              condition: weather[0].description || "Unknown",
              humidity: main.humidity || 0,
              windSpeed: wind.speed || 0,
            };
          })
          .catch((error) => {
            console.error(`Error fetching weather for ${city}:`, error);
            return { city, error: error.message };
          })
      )
    );

    return weatherData.reduce((acc, { city, ...rest }) => {
      acc[city] = rest;
      return acc;
    }, {} as Record<string, WeatherData>);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {}; // Return empty object to prevent app crashes
  }
};

// ✅ Fetch Crypto Prices
export const fetchCryptoPrices = async (): Promise<CryptoPricesData> => {
  try {
    const priceData = await axios.get(CRYPTO_API, {
      params: {
        ids: "bitcoin,ethereum,dogecoin",
        vs_currencies: "usd",
      },
    });

    const historicalData = await axios.get(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
      {
        params: {
          vs_currency: "usd",
          days: "7",
        },
      }
    );

    return {
      currentPrices: priceData.data || {},
      historicalPrices: historicalData.data.prices || [],
    };
  } catch (error) {
    console.error("Error fetching crypto prices:", error);
    return { currentPrices: {}, historicalPrices: [] }; // Return empty data gracefully
  }
};

// ✅ Fetch Crypto News
export const fetchCryptoNews = async (): Promise<NewsArticle[]> => {
  checkApiKey(NEWS_API_KEY, "News");

  try {
    const response = await fetch(`${NEWS_API_URL}?q=cryptocurrency&apiKey=${NEWS_API_KEY}`);
    const data = await response.json();

    if (data.status === "ok") {
      return data.articles || [];
    } else {
      throw new Error('Error fetching news');
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    return []; // Return empty array gracefully
  }
};

// ✅ Fetch Weather History (from a custom API route)
export const fetchWeatherHistory = async (cityName: string): Promise<WeatherData[]> => {
  try {
    const response = await fetch(`/api/weather/history?city=${cityName}`);
    const data = await response.json();
    return data.history;
  } catch (error) {
    console.error("Error fetching weather history:", error);
    return []; // Return empty array gracefully
  }
};

// ✅ Fetch Crypto Details (Remove duplicate declaration)
export const fetchCryptoDetails = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching crypto details for ${id}:`, error);
    return {}; // Return empty object gracefully
  }
};

// Types
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  error?: string; // Added for error handling
}

export interface CryptoData {
  price: number;
  change24h: number;
  market_cap?: number;
  volume?: number;
}

export interface HistoricalPrice {
  time: number;
  price: number;
}

export interface CryptoPricesData {
  currentPrices: Record<string, CryptoData>;
  historicalPrices: HistoricalPrice[];
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: { name: string };
}
