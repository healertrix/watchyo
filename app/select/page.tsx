import React, { Suspense } from 'react';
import MovieSelector from '@/components/mycomponents/MovieSelector';
import LoadingSkeleton from './loading';

export default function SelectPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <MovieSelector />
    </Suspense>
  );
}
