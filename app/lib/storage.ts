import { TestResult } from "./types";

export const storage = {
  saveTestResult: (result: TestResult) => {
    if (typeof window === "undefined") return;
    const existing = JSON.parse(
      localStorage.getItem("sat_test_results") || "[]"
    );
    existing.push(result);
    localStorage.setItem("sat_test_results", JSON.stringify(existing));
  },

  getTestResults: (): TestResult[] => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("sat_test_results") || "[]");
  },
};
