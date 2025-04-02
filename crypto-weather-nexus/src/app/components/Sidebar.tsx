import Link from "next/link";
import { FaCloud, FaNewspaper, FaBitcoin, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg p-6">
      <h2 className="text-2xl font-extrabold text-indigo-600">CryptoWeather Nexus</h2>

      <nav className="mt-6 space-y-4">
        <Link href="/weather" className="flex items-center text-gray-700 hover:text-indigo-600">
          <FaCloud className="mr-3" /> Weather
        </Link>
        <Link href="/crypto" className="flex items-center text-gray-700 hover:text-indigo-600">
          <FaBitcoin className="mr-3" /> Crypto
        </Link>
        <Link href="/news" className="flex items-center text-gray-700 hover:text-indigo-600">
          <FaNewspaper className="mr-3" /> News
        </Link>
      </nav>

      <div className="mt-6 border-t pt-4">
        <Link href="/settings" className="flex items-center text-gray-500 hover:text-indigo-600">
          <FaCog className="mr-3" /> Settings
        </Link>
        <Link href="/logout" className="flex items-center text-red-500 hover:text-red-600 mt-2">
          <FaSignOutAlt className="mr-3" /> Log Out
        </Link>
      </div>
    </aside>
  );
}
