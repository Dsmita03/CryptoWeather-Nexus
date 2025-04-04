import React from 'react';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: { name: string };
  urlToImage?: string;  // Optional image URL
}

interface NewsCardProps {
  article: NewsArticle;
  className?: string;  // Optional className prop
}

const NewsCard: React.FC<NewsCardProps> = ({ article, className = "" }) => {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group ${className}`}
      aria-label={`Read the article: ${article.title}`}
    >
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300 transform group-hover:scale-105 flex flex-col h-full">
        {/* Image Section */}
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-t-lg flex justify-center items-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}

        <div className="flex flex-col p-6 h-full">
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate flex-grow-0">
            {article.title || "No title available"}
          </h2>

          {/* Source */}
          <p className="text-sm text-gray-500 mt-2 flex-grow-0">{article.source?.name || "Unknown Source"}</p>

          {/* Description */}
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 line-clamp-3 flex-grow">
            {article.description || "No description available."}
          </p>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;
