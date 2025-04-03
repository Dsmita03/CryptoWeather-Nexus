// pages/new-york.tsx

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const NewYorkWeather: React.FC = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  // Placeholder data for New York weather (replace with actual API data)
  const cityDetails = {
    cityName: "New York",
    history: [
      { date: "2023-11-01", temperature: 8, condition: "Partly Cloudy" },
      { date: "2023-11-02", temperature: 10, condition: "Sunny" },
      { date: "2023-11-03", temperature: 12, condition: "Rainy" },
      { date: "2023-11-04", temperature: 9, condition: "Cloudy" },
      { date: "2023-11-05", temperature: 11, condition: "Sunny" },
    ],
    forecast: [
      { day: "Tomorrow", temperature: 13, condition: "Sunny" },
      { day: "Day After", temperature: 14, condition: "Partly Cloudy" },
      { day: "2 days after", temperature: 15, condition: "Sunny" },
      { day: "3 days after", temperature: 10, condition: "Rainy" },
      { day: "4 days after", temperature: 12, condition: "Partly Cloudy" },
    ],
  };

  const chartData = {
    labels: cityDetails.history.map((day) => day.date),
    datasets: [
      {
        label: "Temperature (°C)",
        data: cityDetails.history.map((day) => day.temperature),
        borderColor: "#6366f1", // Indigo-500
        backgroundColor: "rgba(100, 116, 235, 0.2)", // Indigo-200 with opacity
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar isOpen={isNavbarOpen} setIsOpen={setIsNavbarOpen} />

      <div
        className="flex-grow flex flex-col items-center py-8 px-4 md:px-8"
        style={{ marginLeft: isNavbarOpen ? "250px" : "0px", transition: "margin-left 0.3s ease" }}
      >
        <div className="w-full max-w-4xl mb-8 mt-16">
          <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-100">
            {cityDetails.cityName} Weather
          </h1>
          <p className="text-lg text-gray-300 text-center mb-6">
            Explore weather history and forecasts for {cityDetails.cityName}.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weather History Card */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-100">Weather History</h2>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-700">Date</th>
                    <th className="py-2 px-4 border-b border-gray-700">Temp (°C)</th>
                    <th className="py-2 px-4 border-b border-gray-700">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {cityDetails.history.map((day, index) => (
                    <tr key={index} className="hover:bg-gray-700 transition-colors">
                      <td className="py-2 px-4 border-b border-gray-700">{day.date}</td>
                      <td className="py-2 px-4 border-b border-gray-700">{day.temperature}</td>
                      <td className="py-2 px-4 border-b border-gray-700">{day.condition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Weather Forecast Card */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-100">Weather Forecast</h2>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-700">Day</th>
                    <th className="py-2 px-4 border-b border-gray-700">Temp (°C)</th>
                    <th className="py-2 px-4 border-b border-gray-700">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {cityDetails.forecast.map((day, index) => (
                    <tr key={index} className="hover:bg-gray-700 transition-colors">
                      <td className="py-2 px-4 border-b border-gray-700">{day.day}</td>
                      <td className="py-2 px-4 border-b border-gray-700">{day.temperature}</td>
                      <td className="py-2 px-4 border-b border-gray-700">{day.condition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Temperature Chart Card */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl md:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-gray-100">Temperature Chart</h2>
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <Line data={chartData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        </div>

        {/* About Section Card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-100">About</h2>
          <p className="text-lg text-gray-300">
            This page provides detailed weather information, including historical data and forecasts, for your selected city.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewYorkWeather;