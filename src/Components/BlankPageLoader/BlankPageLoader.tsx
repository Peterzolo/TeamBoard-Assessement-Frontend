import React from "react";

export const BlankPageLoader = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4 max-w-md mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/2 max-w-xs mx-auto"></div>
        </div>

        {/* Main Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow-lg p-6 space-y-4 border border-gray-100"
            >
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              {/* Content Lines */}
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Content Skeleton */}
        <div className="space-y-4 pt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer Overlay Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      </div>
    </div>
  );
};

export default BlankPageLoader;
