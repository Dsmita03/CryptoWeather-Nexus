import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  fetchSingleCrypto,
  fetchCryptoHistory,
  HistoricalPrice,
  CryptoData,
} from "../../services/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Title, Legend);

const Crypto = () => {
  const router = useRouter();
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [selectedMetric, setSelectedMetric] = useState<"price" | "market_cap" | "volume">("price");
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalPrice[]>([]);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);

  const validCryptos = ["bitcoin", "ethereum", "dogecoin"];

  const fetchLiveData = async () => {
    try {
      setPrevPrice(cryptoData?.price ?? null);
      const data = await fetchSingleCrypto(selectedCrypto);
      setCryptoData(data);
    } catch (err) {
      console.error("Live data error:", err);
    }
  };

  const fetchHistoryData = async () => {
    try {
      const history = await fetchCryptoHistory(selectedCrypto);
      setHistoricalData(history);
    } catch (err) {
      console.error("History data error:", err);
    }
  };

  useEffect(() => {
    if (!validCryptos.includes(selectedCrypto)) {
      router.replace("/404");
    }
  }, [selectedCrypto]);

  useEffect(() => {
    setIsLoading(true);
    fetchLiveData();
    fetchHistoryData();
    const interval = setInterval(fetchLiveData, 10000);
    return () => clearInterval(interval);
  }, [selectedCrypto]);

  useEffect(() => {
    if (cryptoData) setIsLoading(false);
  }, [cryptoData]);

  const formatLargeNumber = (num: number) => {
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const chartData = {
    labels: historicalData.map(({ time }) => {
      if (!time) return "";
      const date = new Date(time);
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    }),
    datasets: [
      {
        label: `${selectedCrypto.toUpperCase()} ${selectedMetric.replace("_", " ").toUpperCase()}`,
        data: historicalData.map((entry) => {
          if (selectedMetric === "market_cap") return entry.market_cap ?? 0;
          if (selectedMetric === "volume") return entry.volume ?? 0;
          return entry.price ?? 0;
        }),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function (context: any) {
            return formatLargeNumber(context.parsed.y);
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#cbd5e1",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
      y: {
        ticks: {
          color: "#cbd5e1",
          callback: function (value: any) {
            return formatLargeNumber(value);
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
  };

  const getFlashColor = () => {
    if (!prevPrice || !cryptoData?.price) return "text-blue-400";
    if (cryptoData.price > prevPrice) return "text-green-400 animate-pulse";
    if (cryptoData.price < prevPrice) return "text-red-400 animate-pulse";
    return "text-blue-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      <Navbar isOpen={isNavbarOpen} setIsOpen={setIsNavbarOpen} />

      <main className={`flex-grow px-4 py-8 transition-all ${isNavbarOpen ? "ml-64" : "ml-20"}`}>
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-2xl mt-16">
          <h1 className="text-4xl font-extrabold text-center mb-6 tracking-wide text-blue-400">
            {selectedCrypto.toUpperCase()} Dashboard
          </h1>

          {/* Crypto Switch */}
          <div className="flex justify-center gap-4 mb-6">
            {validCryptos.map((id) => (
              <button
                key={id}
                onClick={() => setSelectedCrypto(id)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-md ${
                  selectedCrypto === id
                    ? "bg-blue-600 text-white scale-105"
                    : "bg-gray-700 hover:bg-gray-600 hover:scale-105"
                }`}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>

          {/* Metric Switch */}
          <div className="flex justify-center gap-3 mb-6">
            {["price", "market_cap", "volume"].map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric as any)}
                className={`px-3 py-1.5 rounded-md text-sm capitalize transition ${
                  selectedMetric === metric
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {metric.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-center text-sm text-gray-400 animate-pulse mb-2">
              Updating live data...
            </div>
          )}

          {/* Real-time Price Info */}
          {cryptoData && (
            <div className="text-center mb-6">
              <p
                className={`text-3xl font-bold transition-colors duration-300 ${getFlashColor()}`}
              >
                💰 ${cryptoData.price?.toFixed(2)}
              </p>
              <p
                className={`text-sm font-medium ${
                  cryptoData.change24h > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {cryptoData.change24h > 0 ? "▲" : "▼"} {cryptoData.change24h?.toFixed(2)}%
              </p>
              <div className="mt-2 text-gray-300 text-sm space-y-1">
                <p>Market Cap: {formatLargeNumber(cryptoData.market_cap ?? 0)}</p>
                <p>24h Volume: {formatLargeNumber(cryptoData.volume ?? 0)}</p>
              </div>
            </div>
          )}

          {/* Chart */}
          {isLoading ? (
            <div className="h-[400px] bg-gray-600 animate-pulse rounded-lg flex items-center justify-center text-gray-400">
              Loading chart...
            </div>
          ) : (
            <>
              <div className="bg-gray-700 rounded-2xl p-4 h-[400px] shadow-lg">
                <Line data={chartData} options={chartOptions} />
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                🔄 Updates every 10 seconds
              </p>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Crypto;