import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { FaBitcoin, FaEthereum } from "react-icons/fa"; // Import the icons you need

const DogecoinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-16 h-16 mb-3 text-yellow-500">
    <path d="M12 1C6.48 1 2 5.48 2 10c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
  </svg>
);

interface CryptoCardProps {
  id: string;
  price?: string | number;
  change24h?: number;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ id, price = "N/A", change24h }) => {
  const getCryptoIcon = (id: string) => {
    switch (id.toLowerCase()) {
      case "bitcoin":
        return <FaBitcoin className="w-16 h-16 mb-3 text-yellow-500" />;
      case "ethereum":
        return <FaEthereum className="w-16 h-16 mb-3 text-blue-500" />;
      case "dogecoin":
        return <DogecoinIcon />;
      default:
        return <div className="w-16 h-16 mb-3 text-gray-400">N/A</div>;
    }
  };

  const changeClass = clsx(
    "text-sm font-medium mt-1",
    change24h !== undefined
      ? change24h >= 0
        ? "text-green-500"
        : "text-red-500"
      : "text-gray-500"
  );

  const displayPrice = typeof price === "number" ? `$${price.toFixed(2)}` : price;

  return (
    <div className="relative bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-xl">
      {/* Crypto Icon from React Icons or SVG */}
      {getCryptoIcon(id)}

      {/* Crypto Name */}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-white capitalize">{id}</h3>

      {/* Price */}
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-wide transition-all">
        {displayPrice}
      </p>

      {/* 24h Change */}
      <p className={changeClass}>
        {typeof change24h === "number" ? change24h.toFixed(2) : "No data"}% (24h)
      </p>

      {/* View Details Button */}
      <Link href={`/crypto/${id}`} passHref>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          View Details
        </button>
      </Link>
    </div>
  );
};

export default CryptoCard;
