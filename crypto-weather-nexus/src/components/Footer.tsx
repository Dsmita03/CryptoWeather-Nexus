import React from "react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer
      className={`text-center text-gray-500 py-4 border-t border-gray-300 bg-gray-100 dark:bg-gray-900 dark:text-gray-400 ${className}`}
    >
      <p>
        © {new Date().getFullYear()} <span className="font-semibold">CryptoWeather Nexus</span>. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
