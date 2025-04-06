import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchWeather, WeatherData, normalizeCityKey } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Navbar";  

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export default function WeatherDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockHistory, setMockHistory] = useState<number[]>([]);
  const [NavbarOpen, setNavbarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const allWeather = await fetchWeather(); // Should return Record<string, WeatherData>
        const cityKey = normalizeCityKey(id).toLowerCase();
        const data = allWeather[cityKey];

        if (data) {
          setWeatherData(data);

          const history = Array.from({ length: 7 }, () =>
            Math.floor((data.temperature ?? 25) + (Math.random() * 4 - 2))
          );
          setMockHistory(history);
        } else {
          setWeatherData(null);
        }
      } catch (err) {
        console.error("Error fetching weather:", err);
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading weather data...</p>
      </div>
    );

  if (!weatherData)
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p className="text-xl">No weather data found.</p>
      </div>
    );

  const chartData = {
    labels: ["-6h", "-5h", "-4h", "-3h", "-2h", "-1h", "Now"],
    datasets: [
      {
        label: "Temperature (°C)",
        data: mockHistory,
        borderColor: "#60A5FA",
        backgroundColor: "rgba(96, 165, 250, 0.2)",
        tension: 0.3,
        pointRadius: 4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#fff" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      <Navbar isOpen={NavbarOpen} setIsOpen={setNavbarOpen} />

      {/* <button
        onClick={() => setNavbarOpen((prev) => !prev)}
        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md w-max ml-6 mt-4"
      >
        {NavbarOpen ? "Close Navbar" : "Open Navbar"}
      </button> */}

      <main className="flex-grow p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 capitalize">{normalizeCityKey(id as string)}</h1>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-8 grid gap-4 sm:grid-cols-2">
            <p className="text-xl">🌡️ Temperature: {weatherData.temperature}°C</p>
            <p className="text-xl">🌥️ Condition: {weatherData.condition}</p>
            <p className="text-xl">💧 Humidity: {weatherData.humidity}%</p>
            <p className="text-xl">💨 Wind Speed: {weatherData.windSpeed} m/s</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
            <h2 className="text-2xl font-semibold mb-4">📈 Temperature Trend (Past 7 Hours)</h2>
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">🌍 About {normalizeCityKey(id as string)}</h2>
            <p className="text-lg text-gray-300">
              {normalizeCityKey(id as string)} is a vibrant city with unique weather patterns. Keep an eye on updates to plan your day better!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
