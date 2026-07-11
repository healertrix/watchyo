import React from 'react';

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`bg-gray-200 dark:bg-neutral-800 animate-pulse rounded ${className}`}></div>
);

export default function Loading() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white">
      <div className="relative h-[48vh] sm:h-[64vh]">
        <SkeletonBlock className="h-full w-full rounded-none" />
        <div className="absolute bottom-0 left-0 p-4 sm:p-8 lg:p-12 bg-gradient-to-t from-white dark:from-neutral-950 w-full max-w-4xl">
          <SkeletonBlock className="h-10 w-3/4 mb-3 rounded-lg" />
          <SkeletonBlock className="h-4 w-full mb-2" />
          <SkeletonBlock className="h-4 w-2/3 mb-5" />
          <SkeletonBlock className="h-11 w-32 rounded-full" />
        </div>
      </div>

      <div className="p-4 sm:p-8 lg:p-12 max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <SkeletonBlock className="h-12 w-full lg:w-80 rounded-xl" />
          <SkeletonBlock className="h-12 w-full lg:flex-1 lg:max-w-md rounded-xl" />
        </div>

        <div>
          <SkeletonBlock className="h-5 w-24 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                <SkeletonBlock className="h-40 w-full rounded-none" />
                <div className="p-4">
                  <SkeletonBlock className="h-5 w-3/4 mb-2" />
                  <SkeletonBlock className="h-3 w-1/2 mb-2" />
                  <SkeletonBlock className="h-14 w-full mb-4" />
                  <SkeletonBlock className="h-10 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}