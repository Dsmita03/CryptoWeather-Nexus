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
    labels: historicalData.map(({ time }) =>
      new Date(time).toLocaleDateString()
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

          <div className="space-x-4 text-center">
            {["bitcoin", "ethereum", "dogecoin"].map((crypto) => (
              <button
                key={crypto}
                className="text-lg px-4 py-2 rounded-lg bg-blue-500 text-white"
                onClick={() => setSelectedCrypto(crypto)}
              >
                {crypto.charAt(0).toUpperCase() + crypto.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-8 w-full max-w-2xl mx-auto">
            <Line data={chartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Crypto;
