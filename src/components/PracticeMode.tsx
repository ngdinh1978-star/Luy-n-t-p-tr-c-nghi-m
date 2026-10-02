import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, CheckCircle2, XCircle, Lightbulb, ArrowRight, RotateCcw, Filter, Sparkles, Shuffle } from 'lucide-react';
import { Question } from '../types';
import { soundManager } from '../utils/audio';
import { prepareShuffledQuizData } from '../utils/shuffle';

interface PracticeModeProps {
  questions: Question[];
  onFinishQuiz: (score: number, answers: { question: Question; selectedIndex: number; isCorrect: boolean }[]) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (questionId: string) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  questionLimit: number;
  onChangeQuestionLimit: (limit: number) => void;
}

export default function PracticeMode({
  questions,
  onFinishQuiz,
  bookmarkedIds,
  onToggleBookmark,
  categories,
  selectedCategory,
  onSelectCategory,
  questionLimit,
  onChangeQuestionLimit,
}: PracticeModeProps) {
  const [activeQuizData, setActiveQuizData] = useState<Question[]>(() =>
    prepareShuffledQuizData(questions)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<
    { question: Question; selectedIndex: number; isCorrect: boolean }[]
  >([]);

  // When base questions list changes, prepare newly shuffled data
  useEffect(() => {
    setActiveQuizData(prepareShuffledQuizData(questions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnswersHistory([]);
  }, [questions]);

  if (activeQuizData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md mx-auto my-8 shadow-sm">
        <p className="text-slate-600 mb-4 font-medium">Không có câu hỏi nào thuộc chủ đề này.</p>
        <button
          onClick={() => onSelectCategory('Tất cả chủ đề')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl"
        >
          Xem tất cả chủ đề
        </button>
      </div>
    );
  }

  const currentQ = activeQuizData[currentIndex] || activeQuizData[0];
  const isBookmarked = bookmarkedIds.has(currentQ.id);
  const hasAnswered = selectedOption !== null;
  const prefixes = ['A', 'B', 'C', 'D'];

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return;

    setSelectedOption(index);
    const isCorrect = index === currentQ.correct;

    if (isCorrect) {
      soundManager.playCorrect();
      setScore(prev => prev + 1);
    } else {
      soundManager.playWrong();
    }

    setAnswersHistory(prev => [
      ...prev,
      {
        question: currentQ,
        selectedIndex: index,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex < activeQuizData.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      // Finished
      const finalAnswers = [
        ...answersHistory,
      ];
      onFinishQuiz(score, finalAnswers);
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setActiveQuizData(prepareShuffledQuizData(questions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnswersHistory([]);
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      {/* Category & Limit Selector Bar */}
      <div className="bg-white/70 backdrop-blur-xs rounded-xl p-3 mb-4 border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-semibold text-slate-700">Chủ đề:</span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              onSelectCategory(e.target.value);
            }}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Số lượng:</span>
            {[5, 10, 20].map((num) => (
              <button
                key={num}
                onClick={() => {
                  onChangeQuestionLimit(num);
                }}
                className={`px-2 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                  questionLimit === num
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => {
                onChangeQuestionLimit(0);
              }}
              className={`px-2 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                questionLimit === 0
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Tất cả câu hỏi trong chủ đề"
            >
              Tất cả
            </button>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200 transition cursor-pointer"
            title="Xáo trộn lại câu hỏi và vị trí đáp án"
          >
            <Shuffle className="w-3 h-3" />
            <span>Xáo trộn</span>
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-5 sm:p-8 border border-slate-200/90 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mb-5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + (hasAnswered ? 1 : 0)) / activeQuizData.length) * 100}%` }}
          />
        </div>

        {/* Header inside card */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Câu {currentIndex + 1}/{activeQuizData.length}
            </span>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full hidden sm:inline-block">
              {currentQ.category}
            </span>
            {currentQ.difficulty && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                currentQ.difficulty === 'Dễ' ? 'bg-emerald-50 text-emerald-700' :
                currentQ.difficulty === 'Trung bình' ? 'bg-amber-50 text-amber-700' :
                'bg-rose-50 text-rose-700'
              }`}>
                {currentQ.difficulty}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Điểm: {score}
            </span>

            <button
              onClick={() => onToggleBookmark(currentQ.id)}
              className={`p-1.5 rounded-lg border transition ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500'
              }`}
              title={isBookmarked ? 'Bỏ lưu câu hỏi' : 'Lưu câu hỏi cần ôn lại'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 leading-snug">
            {currentQ.question}
          </h2>
          {currentQ.period && (
            <span className="inline-block mt-1 text-xs text-slate-400 font-medium">
              Giai đoạn: {currentQ.period}
            </span>
          )}
        </div>

        {/* Options Container */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((option, index) => {
            let optionStyles = 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-700';
            let badgeStyles = 'bg-slate-100 text-slate-600';
            let icon = null;

            if (hasAnswered) {
              if (index === currentQ.correct) {
                // Correct option (always highlighted green once answered)
                optionStyles = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs';
                badgeStyles = 'bg-emerald-600 text-white';
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />;
              } else if (index === selectedOption) {
                // Wrong user pick
                optionStyles = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 shadow-xs';
                badgeStyles = 'bg-rose-600 text-white';
                icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0 ml-2" />;
              } else {
                optionStyles = 'border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={index}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(index)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex items-center justify-between text-sm sm:text-base font-medium ${
                  !hasAnswered ? 'cursor-pointer' : 'cursor-default'
                } ${optionStyles}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${badgeStyles}`}>
                    {prefixes[index] || index + 1}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Explanation Box (Visible once answered) */}
        {hasAnswered && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 p-4 sm:p-5 rounded-xl bg-blue-50/80 border border-blue-200 text-slate-700 text-sm mb-6 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-blue-900 mb-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Giải thích chi tiết:</span>
            </div>
            <p className="leading-relaxed text-slate-700 pl-6">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Action Button: Next or Results */}
        {hasAnswered && (
          <button
            onClick={handleNext}
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/25 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{currentIndex < activeQuizData.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả tổng kết'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Mini Questions Map at bottom */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {activeQuizData.map((_, idx) => {
              const answered = answersHistory[idx];
              let dotClass = 'bg-slate-200 text-slate-500';
              if (answered) {
                dotClass = answered.isCorrect
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'bg-rose-500 text-white font-bold';
              } else if (idx === currentIndex) {
                dotClass = 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-300';
              }

              return (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] shrink-0 transition-colors ${dotClass}`}
                  title={`Câu ${idx + 1}`}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1 hover:text-indigo-600 transition shrink-0 ml-2 cursor-pointer"
            title="Làm lại bài tập (Xáo trộn mới)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Làm lại (Xáo trộn mới)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
