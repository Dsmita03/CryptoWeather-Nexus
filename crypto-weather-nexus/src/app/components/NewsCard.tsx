"use client";

import React from "react";
import { Calendar, ExternalLink } from "lucide-react";

// Define the article type
interface NewsArticle {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
}

interface Props {
  articles: NewsArticle[];
  isLoading?: boolean;
}

const NewsCard: React.FC<Props> = ({ articles, isLoading }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 w-full border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        📢 Crypto News
      </h3>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 w-full bg-gray-200 animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-300"
              >
                <h4 className="text-lg font-semibold text-gray-900 leading-tight">
                  {article.title}
                </h4>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <span className="font-medium">{article.source}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  <ExternalLink className="w-4 h-4 ml-auto text-blue-500" />
                </div>
              </a>
            ))
          ) : (
            <p className="text-gray-500 text-center">No news available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsCard;