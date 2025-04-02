"use client";

import { useEffect } from "react";
import ChartsSection from "../app/components/ChartsSection";
import { useAppDispatch, useAppSelector } from "../app/redux/hooks";
import { fetchWeather } from "../app/redux/weatherSlice";
import { fetchCrypto } from "../app/redux/cryptoSlice";
import { fetchNews } from "../app/redux/newsSlice";
import Sidebar from "../app/components/Sidebar";
import Header from "../app/components/Header";
import Footer from "../app/components/Footer";
import WeatherCard from "../app/components/WeatherCard";
import CryptoCard from "../app/components/CryptoCard";
import NewsCard from "../app/components/NewsCard";

const DEFAULT_CITY = "New York";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const cryptoData = useAppSelector((state) => state.crypto.data);
  const newsData = useAppSelector((state) => state.news.data);
  const isLoading = useAppSelector((state) => state.news.loading); // ✅ Fix: Defined loading state

  useEffect(() => {
    dispatch(fetchWeather(DEFAULT_CITY));
    dispatch(fetchCrypto());
    dispatch(fetchNews());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-100 to-white">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Content */}
      <div className="flex flex-col w-full">
        {/* ✅ Header */}
        <Header />

        <main className="flex-grow p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, User</h2>

          {/* ✅ Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Weather Card */}
            <WeatherCard city={DEFAULT_CITY} />

            {/* Crypto Card */}
            {cryptoData && cryptoData.length > 0 ? (
              <CryptoCard coin={cryptoData[0]} />
            ) : (
              <p className="text-gray-500 text-center">Loading crypto data...</p>
            )}

            {/* News Section */}
            {newsData && newsData.length > 0 ? (
              <NewsCard articles={newsData} isLoading={isLoading} />
            ) : (
              <p className="text-gray-500 text-center">Loading news...</p>
            )}
          </div>
          

       {/* ✅ Charts Section */}
        <ChartsSection />
        </main>

        {/* ✅ Footer */}
        <Footer />
      </div>
    </div>
  );
}
