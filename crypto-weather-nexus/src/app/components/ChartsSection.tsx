"use client";

import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const bitcoinData = [
  { country: "USA", marketCap: 700, volume: 400 },
  { country: "UK", marketCap: 500, volume: 300 },
  { country: "India", marketCap: 600, volume: 350 },
];

const weatherComparison = [
  { city: "New York", temp: 25, humidity: 65 },
  { city: "London", temp: 18, humidity: 75 },
  { city: "Tokyo", temp: 22, humidity: 70 },
];

const trendingNews = [
  { keyword: "Bitcoin", mentions: 120 },
  { keyword: "Ethereum", mentions: 90 },
  { keyword: "Crypto", mentions: 110 },
];

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white shadow-lg rounded-2xl">
      
      {/* Bitcoin Market Cap Bar Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Bitcoin Market Cap by Country</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bitcoinData}>
            <XAxis dataKey="country" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="marketCap" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bitcoin Volume Pie Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Bitcoin Trading Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie dataKey="volume" data={bitcoinData} cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Weather Comparison Line Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Weather Comparison (Temp & Humidity)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weatherComparison}>
            <XAxis dataKey="city" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temp" stroke="#ff7300" />
            <Line type="monotone" dataKey="humidity" stroke="#387908" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trending News Topics */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Trending News Topics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trendingNews}>
            <XAxis dataKey="keyword" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="mentions" fill="#3498db" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
