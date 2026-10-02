import { Question } from '../types';

/**
 * Fisher-Yates array shuffling algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Prepares a fresh quiz pool:
 * 1. Shuffles the questions order
 * 2. Shuffles the options order inside each question and remaps the correct index
 */
export function prepareShuffledQuizData(questions: Question[]): Question[] {
  const shuffledQuestions = shuffleArray(questions);
  return shuffledQuestions.map(q => {
    const correctAnswerText = q.options[q.correct];
    const shuffledOptions = shuffleArray(q.options);
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);

    return {
      ...q,
      options: shuffledOptions,
      correct: newCorrectIndex !== -1 ? newCorrectIndex : 0,
    };
  });
}
