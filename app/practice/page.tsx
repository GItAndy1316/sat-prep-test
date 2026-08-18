'use client';
import { Suspense } from 'react';
import PracticeContent from './practice-content';

export default function Practice() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <PracticeContent />
    </Suspense>
  );
}
