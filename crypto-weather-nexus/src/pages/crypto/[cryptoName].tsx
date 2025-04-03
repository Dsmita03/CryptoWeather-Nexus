import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Ensure routing works in Next.js
import {
  fetchCryptoDetails,
  fetchCryptoPrices,
  CryptoData,
  HistoricalPrice,
} from "../../services/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Crypto: React.FC = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cryptoData, setCryptoData] = useState<Record<string, CryptoData>>({});
  const [historicalData, setHistoricalData] = useState<HistoricalPrice[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>("bitcoin");
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }

    const fetchInitialData = async () => {
      try {
        const { currentPrices, historicalPrices } = await fetchCryptoPrices();
        setCryptoData(currentPrices || {});
        setHistoricalData(historicalPrices || []);
      } catch (error) {
        console.error("Error fetching initial crypto data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const toggleFavorite = (id: string) => {
    let updatedFavorites = [...favorites];
    if (updatedFavorites.includes(id)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== id);
    } else {
      updatedFavorites.push(id);
    }
    setFavorites(updatedFavorites);

    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const fetchCryptoDetailsData = async (id: string) => {
    try {
      const data = await fetchCryptoDetails(id);
      console.log(data); // Placeholder for extended metrics
    } catch (error) {
      console.error(`Error fetching details for ${id}:`, error);
    }
  };

  useEffect(() => {
    if (selectedCrypto) {
      fetchCryptoDetailsData(selectedCrypto);
    }
  }, [selectedCrypto]);

  useEffect(() => {
    if (!["bitcoin", "ethereum", "dogecoin"].includes(selectedCrypto)) {
      router.replace("/404");
    }
  }, [selectedCrypto, router]);

  // Prepare data for the chart
  const chartData = {
    labels: historicalData.map(({ timestamp }) =>
      new Date(timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: `${selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1)} Historical Price`,
        data: historicalData.map(({ price }) => price),
        borderColor: "#6366f1",
        backgroundColor: "rgba(100, 116, 235, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar isOpen={isNavbarOpen} setIsOpen={setIsNavbarOpen} />

      <div
        className="flex-grow flex flex-col items-center py-8 px-4 md:px-8"
        style={{
          marginLeft: isNavbarOpen ? "250px" : "0px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl mb-8 mt-16">
          <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-100">
            Crypto Tracker
          </h1>
          <p className="text-lg text-gray-300 text-center mb-6">
            Explore live cryptocurrency prices, market trends, and detailed analytics.
          </p>

          {/* Favorite Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Your Favorites</h2>
            <div className="flex flex-wrap gap-4">
              {favorites.length > 0 ? (
                favorites.map((favorite) => (
                  <div
                    key={favorite}
                    className="bg-gray-700 p-4 rounded-lg shadow-md text-gray-300 w-32 text-center hover:bg-gray-600 transition duration-200 ease-in-out"
                  >
                    <p className="font-semibold">{favorite}</p>
                    <button
                      className="text-red-400 mt-2 text-sm hover:text-red-500 transition duration-200"
                      onClick={() => toggleFavorite(favorite)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No favorites yet.</p>
              )}
            </div>
          </div>

          {/* Crypto Selection */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">
              Select Cryptocurrency
            </h2>
            <div className="flex gap-4">
              {["bitcoin", "ethereum", "dogecoin"].map((crypto) => (
                <button
                  key={crypto}
                  className={`p-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${
                    selectedCrypto === crypto
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => setSelectedCrypto(crypto)}
                >
                  {crypto.charAt(0).toUpperCase() + crypto.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Crypto Data Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">
              {selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1)} Data
            </h2>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <p className="text-lg text-gray-300">
                <span className="font-semibold text-gray-100">Price:</span> $
                {cryptoData[selectedCrypto]?.price ?? "N/A"}
              </p>
              <p className="text-lg text-gray-300">
                <span className="font-semibold text-gray-100">24h Change:</span>{" "}
                {cryptoData[selectedCrypto]?.change24h ?? "N/A"}%
              </p>
              <p className="text-lg text-gray-300">
                <span className="font-semibold text-gray-100">Market Cap:</span> $
                {cryptoData[selectedCrypto]?.market_cap ?? "N/A"}
              </p>
            </div>
          </div>

          {/* Historical Data Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Historical Data</h2>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <Line data={chartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Crypto;
