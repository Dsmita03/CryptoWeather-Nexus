import axios from "axios";

// 🌐 Constants
export const SUPPORTED_CRYPTOS = ["bitcoin", "ethereum", "dogecoin"];
export const WEATHER_CITIES = ["New York", "London", "Tokyo"];

// 🔐 Environment Variables
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

// 🌦️ API URLs
const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
const CRYPTO_API = "https://api.coingecko.com/api/v3/simple/price";
const NEWS_API_URL = "https://newsapi.org/v2/everything";

// 🔎 API Key Checker
const checkApiKey = (apiKey: string | undefined, serviceName: string): void => {
  if (!apiKey) {
    console.error(`Error: ${serviceName} API key is missing.`);
    throw new Error(`${serviceName} API key is missing.`);
  }
};

// ✅ Normalize City Keys
export const normalizeCityKey = (key: string): string => {
  const cityMap: Record<string, string> = {
    newyork: "New York",
    london: "London",
    tokyo: "Tokyo",
  };
  return cityMap[key.toLowerCase()] || key;
};

// ✅ Fetch Weather Data
export const fetchWeather = async (): Promise<Record<string, WeatherData>> => {
  checkApiKey(WEATHER_API_KEY, "Weather");

  try {
    const weatherData = await Promise.all(
      WEATHER_CITIES.map(async (city) => {
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
            temperature: main?.temp ?? 0,
            condition: weather?.[0]?.description ?? "Unknown",
            humidity: main?.humidity ?? 0,
            windSpeed: wind?.speed ?? 0,
          };
        } catch (error: any) {
          console.error(`Error fetching weather for ${city}:`, error);
          return {
            city,
            temperature: 0,
            condition: "Unknown",
            humidity: 0,
            windSpeed: 0,
            error: error.message,
          };
        }
      })
    );

    return weatherData.reduce((acc, { city, ...rest }) => {
      // Normalize key to lowercase and map it properly
      const key = normalizeCityKey(city).toLowerCase();
      acc[key] = rest;
      return acc;
    }, {} as Record<string, WeatherData>);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {};
  }
};

// ✅ Fetch Temperature Data  

export const fetchTemperature = async (): Promise<Record<string, WeatherData>> => {
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
            temperature: main?.temp ?? 0,  
            condition: weather?.[0]?.description ?? "Unknown",  
            humidity: main?.humidity ?? 0,  
            windSpeed: wind?.speed ?? 0,  
          };
        } catch (error: any) {
          console.error(`Error fetching weather for ${city}:`, error);
          return { 
            city,
            temperature: 0, 
            condition: "Unknown",  
            humidity: 0,  
            windSpeed: 0, 
            error: error.message,  
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



// ✅ Fetch Crypto Prices & History (7 days)
export const fetchCryptoPrices = async (
  retries = 3,
  delay = 1000
): Promise<CryptoPricesData> => {
  const currentPrices: Record<string, CryptoData> = {};
  const allHistorical: HistoricalPrice[] = [];

  try {
    const priceRes = await axios.get(CRYPTO_API, {
      params: {
        ids: SUPPORTED_CRYPTOS.join(","),
        vs_currencies: "usd",
      },
    });

    SUPPORTED_CRYPTOS.forEach((id) => {
      const data = priceRes.data[id];
      currentPrices[id] = {
        price: data?.usd ?? 0,
        change24h: 0,
        market_cap: 0,
        volume: 0,
      };
    });

    for (const id of SUPPORTED_CRYPTOS) {
      let success = false;
      let attempts = 0;

      while (!success && attempts < retries) {
        try {
          const res = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
            { params: { vs_currency: "usd", days: "7" } }
          );

          const historical = res.data?.prices?.map(
            ([time, price]: [number, number]) => ({
              time,
              price,
              crypto: id,
            })
          ) ?? [];

          allHistorical.push(...historical);
          success = true;
        } catch (error: any) {
          if (error.response?.status === 429) {
            attempts++;
            const wait = delay * attempts;
            console.warn(`Rate limited for ${id}. Retrying in ${wait}ms...`);
            await new Promise((res) => setTimeout(res, wait));
          } else {
            console.error(`Error fetching history for ${id}:`, error);
            break;
          }
        }
      }
    }

    return {
      currentPrices,
      historicalPrices: allHistorical,
    };
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return {
      currentPrices: {},
      historicalPrices: [],
    };
  }
};

// ✅ Fetch News Articles
export const fetchCryptoNews = async (): Promise<NewsResponse> => {
  checkApiKey(NEWS_API_KEY, "News");

  try {
    const res = await axios.get(NEWS_API_URL, {
      params: { q: "cryptocurrency", apiKey: NEWS_API_KEY },
    });

    return { results: res.data?.articles || [] };
  } catch (error) {
    console.error("Error fetching news:", error);
    return { results: [] };
  }
};

// ✅ Fetch Detailed Crypto Info
export const fetchCryptoDetails = async (id: string): Promise<CryptoDetails | null> => {
  try {
    const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching crypto details for ${id}:`, error);
    return null;
  }
};

// ✅ Fetch Live Snapshot of a Single Crypto
export const fetchSingleCrypto = async (id: string): Promise<CryptoData> => {
  try {
    const res = await axios.get(CRYPTO_API, {
      params: {
        ids: id,
        vs_currencies: "usd",
        include_24hr_change: "true",
        include_market_cap: "true",
        include_24hr_vol: "true",
      },
    });

    const data = res.data[id];

    return {
      price: data?.usd ?? 0,
      change24h: data?.usd_24h_change ?? 0,
      market_cap: data?.usd_market_cap ?? 0,
      volume: data?.usd_24h_vol ?? 0,
    };
  } catch (error) {
    console.error("Error fetching single crypto:", error);
    return { price: 0, change24h: 0, market_cap: 0, volume: 0 };
  }
};

// ✅ Fetch 1-Day Historical Data (Hourly)
export const fetchCryptoHistory = async (
  id: string
): Promise<HistoricalPrice[]> => {
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days: "1",
          interval: "hourly",
        },
      }
    );

    // Combine the time series data
    const prices = data.prices || [];
    const marketCaps = data.market_caps || [];
    const volumes = data.total_volumes || [];

    const combined: HistoricalPrice[] = prices.map((entry: any, index: number) => ({
      time: entry[0],
      price: entry[1],
      market_cap: marketCaps[index]?.[1] ?? 0,
      volume: volumes[index]?.[1] ?? 0,
    }));

    return combined;
  } catch (err) {
    console.error("Error fetching historical crypto data:", err);
    return [];
  }
};

//
// ===== TYPES =====
//

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  error?: string;
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
  time: number;
  price: number;
  crypto?: string;
  market_cap: number;
  volume: number;
}

export interface CryptoPricesData {
  currentPrices: Record<string, CryptoData>;
  historicalPrices: HistoricalPrice[];
}

export interface CryptoDetails {
  id: string;
  name: string;
  symbol: string;
  description: { en: string };
  market_data?: {
    current_price: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    market_cap: { usd: number };
  };
  image?: { thumb: string; small: string; large: string };
  [key: string]: any;
}
