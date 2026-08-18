'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TestResult {
  score: number;
  date: string;
  correct: number;
  total: number;
  subject: string;
}

export default function Progress() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('sat_test_results') || '[]');
      setTests(saved);
      if (saved.length > 0) {
        const avg = Math.round(saved.reduce((sum: number, t: TestResult) => sum + t.score, 0) / saved.length);
        setAvgScore(avg);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="text-indigo-600 mb-4 inline-block">← Back</Link>
        <h1 className="text-3xl font-bold text-indigo-600 mb-8">Progress</h1>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded text-center">
            <p className="text-3xl font-bold text-indigo-600">{tests.length}</p>
            <p className="text-gray-600">Tests</p>
          </div>
          <div className="bg-white p-6 rounded text-center">
            <p className="text-3xl font-bold text-indigo-600">{tests.length > 0 ? avgScore : 0}%</p>
            <p className="text-gray-600">Average</p>
          </div>
        </div>

        <div className="bg-white rounded p-6">
          <h2 className="text-xl font-bold mb-4">Test History</h2>
          {tests.length > 0 ? (
            tests.slice().reverse().map((test, i) => (
              <div key={i} className="flex justify-between p-3 border-b">
                <div>
                  <p className="font-bold text-indigo-600">{test.score}%</p>
                  <p className="text-sm text-gray-600">{new Date(test.date).toLocaleDateString()}</p>
                </div>
                <p className="text-gray-600">{test.correct}/{test.total}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No tests yet</p>
          )}
        </div>
      </div>
    </main>
  );
}
