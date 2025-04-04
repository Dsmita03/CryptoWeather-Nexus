import axios from "axios";

const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
const CRYPTO_API = "https://api.coingecko.com/api/v3/simple/price";
const NEWS_API_URL = "https://newsapi.org/v2/everything";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

// Utility function to check for missing API keys
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
      cities.map(async (city) => {
        try {
          const response = await axios.get(WEATHER_API, {
            params: {
              q: city,
              appid: WEATHER_API_KEY,
              units: "metric",
            },
          });

          const { main, weather, wind } = response.data;

          return {
            city,
            temperature: main?.temp ?? 0, // Default to 0 if temp is missing
            condition: weather?.[0]?.description ?? "Unknown", // Default to "Unknown" if condition is missing
            humidity: main?.humidity ?? 0, // Default to 0 if humidity is missing
            windSpeed: wind?.speed ?? 0, // Default to 0 if windSpeed is missing
          };
        } catch (error: any) {
          console.error(`Error fetching weather for ${city}:`, error);
          return { 
            city,
            temperature: 0, // Default values to ensure WeatherData type
            condition: "Unknown", // Default condition
            humidity: 0, // Default humidity
            windSpeed: 0, // Default wind speed
            error: error.message, // Include the error message
          };
        }
      })
    );

    return weatherData.reduce((acc, { city, ...rest }) => {
      acc[city] = rest;
      return acc;
    }, {} as Record<string, WeatherData>);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {}; // Return empty object to prevent app crash
  }
};


// ✅ Fetch Crypto Prices with Retry Mechanism
export const fetchCryptoPrices = async (
  retries = 3,
  delay = 1000
): Promise<CryptoPricesData> => {
  try {
    const [priceResponse, historicalResponse] = await Promise.all([
      axios.get(CRYPTO_API, {
        params: { ids: "bitcoin,ethereum,dogecoin", vs_currencies: "usd" },
      }),
      axios.get("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart", {
        params: { vs_currency: "usd", days: "7" },
      }),
    ]);

    return {
      currentPrices: priceResponse.data || {},
      historicalPrices:
        historicalResponse.data?.prices?.map(([time, price]: [number, number]) => ({
          time,
          price,
        })) || [],
    };
  } catch (error: any) {
    if (error.response?.status === 429 && retries > 0) {
      console.warn(`Rate limited. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchCryptoPrices(retries - 1, delay * 2);
    }
    console.error("Error fetching crypto prices:", error);
    return { currentPrices: {}, historicalPrices: [] };
  }
};

// ✅ Fetch Crypto News
export const fetchCryptoNews = async (): Promise<NewsResponse> => {
  checkApiKey(NEWS_API_KEY, "News");

  try {
    const response = await axios.get(NEWS_API_URL, {
      params: { q: "cryptocurrency", apiKey: NEWS_API_KEY },
    });

    return { results: response.data?.articles || [] };
  } catch (error) {
    console.error("Error fetching news:", error);
    return { results: [] }; // Return empty results in case of error
  }
};

// ✅ Fetch Crypto Details
export const fetchCryptoDetails = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
    return response.data || {};
  } catch (error) {
    console.error(`Error fetching crypto details for ${id}:`, error);
    return {};
  }
};

// ✅ Type Definitions
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  error?: string; // Optional error field for error handling
}

export interface NewsResponse {
  results: NewsArticle[];
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: { name: string };
}

export interface CryptoData {
  price: number;
  change24h: number;
  market_cap?: number;
  volume?: number;
}

export interface HistoricalPrice {
  time: number; // Change from timestamp to time
  price: number;
}

export interface CryptoPricesData {
  currentPrices: Record<string, CryptoData>;
  historicalPrices: HistoricalPrice[];
}
