import Link from "next/link";
import { FiHome, FiCloud, FiDollarSign, FiMenu } from "react-icons/fi";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [isWeatherOpen, setIsWeatherOpen] = useState(false); // Manage Weather Sub-nav state

  return (
    <div className="flex">
      {/* 📌 Sidebar (Fixed, Full Height, Non-Overlapping) */}
      <div
        className={`bg-blue-700 text-white p-4 transition-all duration-300 flex flex-col h-screen ${
          isOpen ? "w-64" : "w-20"
        } fixed top-0 left-0 shadow-lg z-50`}
      >
        {/* Toggle Button */}
        <button
          className="text-2xl p-2 rounded-md bg-white text-blue-700 hover:bg-blue-100 transition self-end"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiMenu />
        </button>

        {/* Navigation Links */}
        <nav className="mt-8 flex flex-col gap-4 flex-grow">
          <SidebarItem href="/" icon={<FiHome />} label="Dashboard" isOpen={isOpen} />
          {/* Weather Link with Sub-nav */}
          <div>
            <SidebarItem
              href="#"
              icon={<FiCloud />}
              label="Weather"
              isOpen={isOpen}
              onClick={() => setIsWeatherOpen(!isWeatherOpen)} // Toggle sub-nav
            />
            {isWeatherOpen && isOpen && (
              <div className="ml-6 mt-2">
                <SidebarSubItem href="/weather/newyork" label="New York" />
                <SidebarSubItem href="/weather/london" label="London" />
                <SidebarSubItem href="/weather/tokyo" label="Tokyo" />
              </div>
            )}
          </div>
          <SidebarItem href="/crypto" icon={<FiDollarSign />} label="Crypto" isOpen={isOpen} />
        </nav>
      </div>
    </div>
  );
};

// 📌 Reusable Sidebar Item Component (Fixed Types)
interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  className?: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label, isOpen, className, onClick }) => (
  <Link
    href={href}
    className={`flex items-center gap-3 p-3 rounded-md hover:bg-blue-800 transition ${className || ""}`}
    onClick={onClick}
  >
    <span className="text-xl">{icon}</span>
    {isOpen && <span className="text-lg font-medium">{label}</span>}
  </Link>
);

// 📌 Reusable Sidebar Sub Item Component
interface SidebarSubItemProps {
  href: string;
  label: string;
}

const SidebarSubItem: React.FC<SidebarSubItemProps> = ({ href, label }) => (
  <Link
    href={href}
    className="flex items-center gap-3 p-3 text-sm text-gray-200 hover:bg-blue-800 transition"
  >
    <span className="text-lg">{label}</span>
  </Link>
);

export default Sidebar;
