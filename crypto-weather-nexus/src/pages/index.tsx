import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchWeather, fetchCryptoPrices, fetchCryptoNews } from "../services/api";
import useWebSocket from "../hooks/useWebSocket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getNewsData } from "../store/newsSlice";
import WeatherCard from "../components/WeatherCard";
import CryptoCard from "../components/CryptoCard";
import NewsCard from "../components/NewsCard";
import Footer from "../components/Footer";

// Lazy Load Charts
const Sidebar = dynamic(() => import("../components/Navbar"), { ssr: false });
const LineChart = dynamic(() => import("../components/LineChart"), { ssr: false });
const PieChart = dynamic(() => import("../components/PieChart"), { ssr: false });
const BarGraph = dynamic(() => import("../components/BarGraph"), { ssr: false });

// Types
interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface CryptoData {
  price: number;
  change24h: number;
  market_cap?: number;
  volume?: number;
}

interface HistoricalPrice {
  time: number;
  price: number;
}

interface DashboardProps {
  weather: Record<string, WeatherData>;
  crypto: Record<string, CryptoData>;
  news: { results: { title: string; link: string; source: { name: string } }[] };
  historicalBitcoinPrices: HistoricalPrice[];
}

// Server-side Data Fetching
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { currentPrices, historicalPrices } = await fetchCryptoPrices();
    const [weather, news] = await Promise.all([fetchWeather(), fetchCryptoNews()]);

    return {
      props: {
        weather: weather || {},
        crypto: currentPrices || {},
        news: { results: news?.results || [] },
        historicalBitcoinPrices: historicalPrices || [],
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        weather: {},
        crypto: {},
        news: { results: [] },
        historicalBitcoinPrices: [],
      },
    };
  }
};

const Dashboard: React.FC<DashboardProps> = ({ weather, crypto, news, historicalBitcoinPrices }) => {
  const dispatch = useDispatch();
  useWebSocket(); // Live price updates via WebSocket

  const { articles, loading } = useSelector((state: RootState) => state.news);
  const livePrices = useSelector((state: RootState) => state.websocket.livePrices || {});

  useEffect(() => {
    dispatch(getNewsData());
  }, [dispatch]);

  // Merge Initial & Real-Time Crypto Prices
  const mergedCryptoPrices = { ...crypto, ...livePrices };

  // 🎯 Update Bitcoin Historical Prices in Real-Time
  const [updatedBitcoinPrices, setUpdatedBitcoinPrices] = useState(historicalBitcoinPrices);

  useEffect(() => {
    if (livePrices["bitcoin"]?.price) {
      const newPrice: HistoricalPrice = {
        time: Date.now(), // Use current timestamp for real-time update
        price: livePrices["bitcoin"].price,
      };
      setUpdatedBitcoinPrices((prevPrices) => [...prevPrices.slice(-19), newPrice]); // Keep last 20 data points
    }
  }, [livePrices]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const selectedCryptos = ["bitcoin", "ethereum", "dogecoin"];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={`flex-1 p-8 transition-all ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">
          CryptoWeather Nexus Dashboard
        </h1>

        {/* 🌦 Weather Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {["New York", "London", "Tokyo"].map((city) => (
            <WeatherCard key={city} city={city} weather={weather[city] || { temperature: 0, condition: "N/A", humidity: 0, windSpeed: 0 }} />
          ))}
        </div>

        {/* 💰 Cryptocurrency Section */}
        <h2 className="text-2xl font-bold mt-10 mb-4">Live Cryptocurrency Prices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {selectedCryptos.map((id) => (
            <CryptoCard
              key={id}
              id={id}
              price={mergedCryptoPrices[id]?.price ? `$${mergedCryptoPrices[id]?.price.toFixed(2)}` : "N/A"}
              change24h={mergedCryptoPrices[id]?.change24h}
            />
          ))}
        </div>

        {/* 📰 News Section */}
        <h2 className="text-2xl font-bold mt-10 mb-4">Latest Crypto News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <p className="text-center text-gray-500 col-span-3">Loading news...</p> :
            articles.slice(0, 5).map((article, index) => <NewsCard key={index} article={article} />)
          }
        </div>

        {/* 📊 Charts Section */}
        <h2 className="text-2xl font-bold mt-10 mb-4">Market Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Real-Time LineChart for Bitcoin */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold text-lg mb-3">Bitcoin Price History (Live)</h3>
            <LineChart data={updatedBitcoinPrices} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold text-lg mb-3">Crypto Price Comparisons</h3>
            <BarGraph prices={Object.entries(mergedCryptoPrices).map(([name, data]) => ({ name, price: data.price || 0 }))} />
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-semibold text-lg text-center">Market Distribution</h3>
              <div className="w-64 h-64 mx-auto">
                <PieChart data={Object.entries(mergedCryptoPrices).map(([name, data]) => ({ name, value: data.price }))} />
              </div>
            </div>
          </div>
        </div>

        <Footer className="mt-10" />
      </div>
    </div>
  );
};

export default Dashboard;
