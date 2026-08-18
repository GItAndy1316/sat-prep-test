'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { storage } from '@/app/lib/storage';

interface Question {
  id: string;
  subject: string;
  topic: string;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function PracticeContent() {
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get('subject') || 'mixed';

  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/sat_questions_100.json')
      .then(res => res.json())
      .then(data => {
        let questions = data.flashcards || [];
        if (subjectParam !== 'mixed') {
          questions = questions.filter((q: Question) => q.subject === subjectParam);
        }
        const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
        setTestQuestions(shuffled);
        setIsLoading(false);
      });
  }, [subjectParam]);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (finished) {
    const subjectLabel = subjectParam === 'math' ? '📐 Math' : subjectParam === 'english' ? '📝 English' : 'Mixed';
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">Complete!</h1>
          <p className="text-6xl font-bold text-indigo-600 mb-4">{score}%</p>
          <p className="text-xl text-gray-600 mb-8">{subjectLabel}</p>
          <Link href="/" className="bg-indigo-600 text-white px-8 py-3 rounded font-bold">Home</Link>
        </div>
      </main>
    );
  }

  if (testQuestions.length === 0) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const question = testQuestions[currentIndex];
  const answered = answers[currentIndex] !== undefined;
  const progress = ((currentIndex + 1) / testQuestions.length) * 100;

  const handleFinish = () => {
    const correct = Object.entries(answers).filter(
      ([idx, ansIdx]) => testQuestions[parseInt(idx)].correctAnswer === ansIdx
    ).length;
    const finalScore = Math.round((correct / testQuestions.length) * 100);
    storage.saveTestResult({ score: finalScore, date: new Date().toISOString(), correct, total: testQuestions.length, subject: subjectParam });
    setScore(finalScore);
    setFinished(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="text-indigo-600 mb-4 inline-block">← Back</Link>
        <h1 className="text-2xl font-bold mb-4">Q{currentIndex + 1} of {testQuestions.length}</h1>
        <div className="w-full bg-gray-200 h-2 rounded mb-8"><div className="bg-indigo-600 h-2 rounded" style={{ width: `${progress}%` }}></div></div>

        <div className="bg-white rounded p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">{question.question}</h2>
          <div className="space-y-3">
            {question.options.map((opt: string, i: number) => (
              <button key={i} onClick={() => setAnswers(a => ({ ...a, [currentIndex]: i }))} disabled={answered}
                className={`w-full p-4 text-left rounded border-2 ${
                  answers[currentIndex] === i 
                    ? i === question.correctAnswer 
                      ? 'bg-green-100 border-green-500' 
                      : 'bg-red-100 border-red-500' 
                    : 'border-gray-300'
                }`}>
                {String.fromCharCode(65 + i)}) {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="flex-1 border-2 border-indigo-600 text-indigo-600 py-3 rounded font-bold">← Previous</button>
          {currentIndex < testQuestions.length - 1 ? (
            <button onClick={() => setCurrentIndex(currentIndex + 1)} className="flex-1 bg-indigo-600 text-white py-3 rounded font-bold">Next →</button>
          ) : (
            <button onClick={handleFinish} className="flex-1 bg-green-600 text-white py-3 rounded font-bold">Finish</button>
          )}
        </div>
      </div>
    </main>
  );
}
