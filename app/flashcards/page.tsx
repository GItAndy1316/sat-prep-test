'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function Flashcards() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/sat_questions_100.json')
      .then(res => res.json())
      .then(data => {
        setQuestions(data.flashcards || []);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (questions.length === 0) return <div className="flex justify-center items-center h-screen">No questions found</div>;

  const question = questions[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex];
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = isAnswered && selectedAnswer === question.correctAnswer;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    
    const newAnswers = { ...selectedAnswers, [currentIndex]: index };
    setSelectedAnswers(newAnswers);

    const newStats = { ...stats };
    if (index === question.correctAnswer) {
      newStats.correct += 1;
    } else {
      newStats.incorrect += 1;
    }
    setStats(newStats);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="text-indigo-600 mb-4 inline-block">← Back</Link>
        <h1 className="text-2xl font-bold mb-4">Flashcards - Q{currentIndex + 1} of {questions.length}</h1>
        
        <div className="w-full bg-gray-200 h-2 rounded mb-4">
          <div className="bg-indigo-600 h-2 rounded" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="text-center bg-white p-4 rounded"><p className="text-2xl font-bold text-green-600">{stats.correct}</p><p>Correct</p></div>
          <div className="text-center bg-white p-4 rounded"><p className="text-2xl font-bold text-red-600">{stats.incorrect}</p><p>Incorrect</p></div>
        </div>

        <div className="bg-white rounded p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">{question.question}</h2>
          <div className="space-y-3">
            {question.options.map((option: string, i: number) => (
              <button key={i} onClick={() => handleAnswer(i)} disabled={isAnswered}
                className={`w-full p-4 text-left rounded border-2 ${
                  selectedAnswer === i 
                    ? i === question.correctAnswer 
                      ? 'bg-green-100 border-green-500' 
                      : 'bg-red-100 border-red-500' 
                    : 'border-gray-300'
                }`}>
                {String.fromCharCode(65 + i)}) {option}
              </button>
            ))}
          </div>
        </div>

        {isAnswered && (
          <div className={`p-4 rounded mb-8 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="font-bold">{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</p>
            <p>{question.explanation}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="flex-1 border-2 border-indigo-600 text-indigo-600 py-3 rounded font-bold">← Previous</button>
          <button onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))} className="flex-1 bg-indigo-600 text-white py-3 rounded font-bold">Next →</button>
        </div>
      </div>
    </main>
  );
}
