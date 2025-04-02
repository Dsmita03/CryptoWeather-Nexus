interface CryptoProps {
  coin?: {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    market_cap: number;
    price_change_percentage_24h: number;
    image?: string; // ✅ Added image for better UI
  };
}

export default function CryptoCard({ coin }: CryptoProps) {
  if (!coin) {
    return (
      <div className="flex justify-center items-center bg-white shadow-md rounded-lg p-6 animate-pulse">
        <p className="text-gray-500">Loading crypto data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl rounded-lg p-6 text-white transform transition-all hover:scale-105 hover:shadow-2xl">
      {/* Crypto Header */}
      <div className="flex items-center gap-4">
        <img
          src={coin.image}
          alt={coin.name}
          className="w-12 h-12 object-contain rounded-full border-2 border-white shadow-md"
        />
        <h2 className="text-2xl font-bold">
          {coin.name} <span className="text-gray-300">({coin.symbol.toUpperCase()})</span>
        </h2>
      </div>

      {/* Crypto Details */}
      <div className="mt-4 space-y-2">
        <p className="text-lg">💰 Price: <span className="font-semibold">${coin.current_price.toFixed(2)}</span></p>
        <p className={`text-lg ${coin.price_change_percentage_24h >= 0 ? "text-green-300" : "text-red-400"}`}>
          📊 24h Change: <span className="font-semibold">{coin.price_change_percentage_24h.toFixed(2)}%</span>
        </p>
        <p className="text-lg">🏦 Market Cap: <span className="font-semibold">${coin.market_cap.toLocaleString()}</span></p>
      </div>

      {/* Call to Action */}
      <div className="mt-4 flex justify-between items-center">
        <a
          href={`https://www.coingecko.com/en/coins/${coin.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold shadow-md hover:bg-gray-100 transition"
        >
          View Details
        </a>
        <span className="text-sm bg-black/30 px-3 py-1 rounded-md">
          Powered by CoinGecko
        </span>
      </div>
    </div>
  );
}
