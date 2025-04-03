import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { fetchCryptoDetails, HistoricalPrice } from "../../services/api";
import CryptoHistoryChart from "../../components/CryptoHistoryChart";
import CryptoMetricsTable from "../../components/CryptoMetricsTable";
import Navbar from "../../components/Navbar"; // ✅ Fixed import
import { Loader2 } from "lucide-react"; // Modern loading spinner

// Type Definitions
interface CryptoMetrics {
  market_cap: number;
  volume: number;
  supply: number;
  volume_24h: number;
  circulating_supply: number;
  total_supply: number;
}

interface CryptoDetailsProps {
  cryptoName: string;
  historicalData: HistoricalPrice[];
  extendedMetrics: CryptoMetrics;
}

const CryptoDetails: React.FC<CryptoDetailsProps> = ({ cryptoName, historicalData, extendedMetrics }) => {
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // ✅ Sidebar toggle state

  useEffect(() => {
    if (historicalData.length > 0) {
      setLoading(false);
    }
  }, [historicalData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
        <p className="mt-4 text-gray-600 text-lg font-semibold">Loading {cryptoName} data...</p>
      </div>
    );
  }

  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-2xl font-semibold text-red-500">Data not found for {cryptoName}.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} /> {/* ✅ Passing props */}
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">{cryptoName} Details</h1>

        {/* Grid Layout for Beautiful UI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crypto History Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg transition hover:shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Price History</h2>
            <CryptoHistoryChart data={historicalData} />
          </div>

          {/* Extended Metrics Table */}
          <div className="bg-white p-6 rounded-xl shadow-lg transition hover:shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Market Metrics</h2>
            <CryptoMetricsTable data={extendedMetrics} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const cryptoName = params?.cryptoName as string;

  try {
    const { historicalData, extendedMetrics } = await fetchCryptoDetails(cryptoName);

    return {
      props: {
        cryptoName,
        historicalData: historicalData ?? [],
        extendedMetrics: extendedMetrics ?? {
          market_cap: 0,
          volume: 0,
          supply: 0,
          volume_24h: 0,
          circulating_supply: 0,
          total_supply: 0,
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching data for ${cryptoName}:`, error);
    
    return {
      props: {
        cryptoName,
        historicalData: [],
        extendedMetrics: {
          market_cap: 0,
          volume: 0,
          supply: 0,
          volume_24h: 0,
          circulating_supply: 0,
          total_supply: 0,
        },
      },
    };
  }
};

export default CryptoDetails;
