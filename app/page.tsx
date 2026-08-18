'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [stats, setStats] = useState({ tests: 0, avgScore: 0, mathAvg: 0, englishAvg: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tests = JSON.parse(localStorage.getItem('sat_test_results') || '[]');
      const mathTests = tests.filter((t: any) => t.subject === 'math');
      const englishTests = tests.filter((t: any) => t.subject === 'english');
      
      const avgScore = tests.length > 0 
        ? Math.round(tests.reduce((sum: number, t: any) => sum + t.score, 0) / tests.length)
        : 0;
      
      const mathAvg = mathTests.length > 0
        ? Math.round(mathTests.reduce((sum: number, t: any) => sum + t.score, 0) / mathTests.length)
        : 0;
        
      const englishAvg = englishTests.length > 0
        ? Math.round(englishTests.reduce((sum: number, t: any) => sum + t.score, 0) / englishTests.length)
        : 0;

      setStats({ tests: tests.length, avgScore, mathAvg, englishAvg });
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-600 mb-2">SAT Prep</h1>
          <p className="text-xl text-gray-600">Welcome Back!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-4xl font-bold text-indigo-600">{stats.tests}</p>
            <p className="text-gray-600 mt-2">Tests Taken</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-4xl font-bold text-indigo-600">{stats.avgScore}%</p>
            <p className="text-gray-600 mt-2">Overall Average</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-lg text-gray-600">100+ Questions</p>
            <p className="text-2xl font-bold text-indigo-600 mt-2">Available</p>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/flashcards" className="block w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-bold text-center hover:bg-indigo-700 transition">
            📚 Study Flashcards
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/practice?subject=math" className="block bg-blue-600 text-white py-4 px-6 rounded-lg font-bold text-center hover:bg-blue-700 transition">
              📐 Math Test
            </Link>
            <Link href="/practice?subject=english" className="block bg-purple-600 text-white py-4 px-6 rounded-lg font-bold text-center hover:bg-purple-700 transition">
              📝 English Test
            </Link>
          </div>

          <Link href="/progress" className="block w-full bg-gray-600 text-white py-4 px-6 rounded-lg font-bold text-center hover:bg-gray-700 transition">
            📊 View Progress
          </Link>
        </div>
      </div>
    </main>
  );
}
