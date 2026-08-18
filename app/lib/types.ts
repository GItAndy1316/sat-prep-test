export interface Question {
  id: string;
  subject: "math" | "english";
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TestResult {
  score: number;
  date: string;
  correct: number;
  total: number;
  subject: string;
}
