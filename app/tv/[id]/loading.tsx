import React from 'react';

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`bg-gray-300 dark:bg-gray-600 rounded ${className}`}></div>
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="relative h-[30vh] sm:h-[50vh]">
        <SkeletonBlock className="h-full w-full" />
        <div className="absolute bottom-0 left-0 p-4 sm:p-8 bg-gradient-to-t from-gray-100 dark:from-gray-900 w-full">
          <SkeletonBlock className="h-8 w-3/4 mb-2" />
          <SkeletonBlock className="h-4 w-full mb-2" />
          <SkeletonBlock className="h-4 w-2/3" />
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <div className="mb-8">
          <SkeletonBlock className="h-6 w-32 mb-4" />
          <SkeletonBlock className="h-12 w-full sm:w-1/2 lg:w-1/3" />
        </div>

        <div>
          <SkeletonBlock className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <SkeletonBlock className="h-40 w-full" />
                <div className="p-4">
                  <SkeletonBlock className="h-6 w-3/4 mb-2" />
                  <SkeletonBlock className="h-4 w-1/2 mb-2" />
                  <SkeletonBlock className="h-16 w-full mb-4" />
                  <SkeletonBlock className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}