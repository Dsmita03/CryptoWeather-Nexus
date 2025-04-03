import React from "react";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div
      className="bg-red-600 text-white p-3 rounded-lg text-center shadow-md flex items-center justify-center space-x-2"
      role="alert"
    >
      {/* 🚨 Error Icon (SVG) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M4.93 4.93a10 10 0 1 1 14.14 14.14A10 10 0 0 1 4.93 4.93z" />
      </svg>

      {/* 📝 Error Message */}
      <span>{message || "An unexpected error occurred. Please try again."}</span>
    </div>
  );
};

export default ErrorMessage;
