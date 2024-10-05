import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="mb-8">
        <div className="max-w-md mx-auto">
          <div className="h-10 bg-gray-500 bg-opacity-5 rounded-full"></div>
        </div>
      </div>

      {/* Movie grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-gray-500 bg-opacity-5 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 opacity-5 animate-shimmer"></div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gray-500 to-transparent opacity-5">
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-500 bg-opacity-10 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-500 bg-opacity-10 rounded"></div>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="h-6 w-12 bg-gray-500 bg-opacity-10 rounded"></div>
                  <div className="h-4 w-16 bg-gray-500 bg-opacity-10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more button */}
      <div className="mt-8 flex justify-center">
        <div className="h-10 w-32 bg-gray-500 bg-opacity-5 rounded"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;