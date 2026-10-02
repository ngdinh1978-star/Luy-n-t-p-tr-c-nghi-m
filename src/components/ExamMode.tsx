import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle, Flag, ChevronLeft, ChevronRight, Send, HelpCircle, RotateCcw } from 'lucide-react';
import { Question } from '../types';
import { soundManager } from '../utils/audio';
import { prepareShuffledQuizData } from '../utils/shuffle';

interface ExamModeProps {
  questions: Question[];
  onFinishExam: (score: number, answers: { question: Question; selectedIndex: number; isCorrect: boolean }[]) => void;
  examDurationMinutes?: number;
}

export default function ExamMode({
  questions,
  onFinishExam,
  examDurationMinutes = 15,
}: ExamModeProps) {
  const [examQuestions] = useState<Question[]>(() => prepareShuffledQuizData(questions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(examDurationMinutes * 60);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds]);

  const currentQ = examQuestions[currentIndex] || examQuestions[0];
  const prefixes = ['A', 'B', 'C', 'D'];
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (optionIndex: number) => {
    soundManager.playClick();
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const toggleFlag = (idx: number) => {
    soundManager.playClick();
    setFlaggedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleSubmitExam = () => {
    setIsSubmitModalOpen(false);
    let finalScore = 0;
    const history = examQuestions.map((q, idx) => {
      const selected = selectedAnswers[idx] ?? -1;
      const isCorrect = selected === q.correct;
      if (isCorrect) finalScore++;
      return {
        question: q,
        selectedIndex: selected,
        isCorrect
      };
    });

    onFinishExam(finalScore, history);
  };


  // Format time MM:SS
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isTimeCritical = timeLeftSeconds < 120; // under 2 mins

  return (
    <div className="max-w-4xl w-full mx-auto">
      {/* Exam Header bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Chế độ Thi Thử Chuẩn
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 mt-1">
            Bài thi trắc nghiệm Lịch sử ({examQuestions.length} câu)
          </h2>
          <p className="text-xs text-slate-500">
            Đã làm: {answeredCount}/{examQuestions.length} câu
          </p>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl font-mono text-lg font-bold border transition ${
          isTimeCritical
            ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
        }`}>
          <Clock className={`w-5 h-5 ${isTimeCritical ? 'text-rose-600' : 'text-indigo-600'}`} />
          <span>{timeFormatted}</span>
        </div>

        {/* Submit button */}
        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Nộp bài thi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Current Question */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                  Câu {currentIndex + 1}
                </span>
                <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {currentQ.category}
                </span>
              </div>

              <button
                onClick={() => toggleFlag(currentIndex)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                  flaggedQuestions.has(currentIndex)
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-amber-600'
                }`}
                title="Đánh dấu để xem lại trước khi nộp"
              >
                <Flag className={`w-3.5 h-3.5 ${flaggedQuestions.has(currentIndex) ? 'fill-amber-600 text-amber-600' : ''}`} />
                <span>{flaggedQuestions.has(currentIndex) ? 'Đã đánh dấu' : 'Đánh dấu câu'}</span>
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-6 leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm sm:text-base font-medium flex items-center gap-3 transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-950 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {prefixes[idx]}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              disabled={currentIndex === 0}
              onClick={() => {
                soundManager.playClick();
                setCurrentIndex(prev => prev - 1);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <span className="text-xs text-slate-400">
              {currentIndex + 1} / {examQuestions.length}
            </span>

            <button
              disabled={currentIndex === examQuestions.length - 1}
              onClick={() => {
                soundManager.playClick();
                setCurrentIndex(prev => prev + 1);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 cursor-pointer"
            >
              <span>Câu sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Col: Question Grid / Matrix */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col">
          <h4 className="text-sm font-bold text-slate-800 mb-3">
            Bảng câu hỏi ({answeredCount}/{examQuestions.length})
          </h4>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-indigo-600"></span>
              <span>Đã chọn đáp án</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-300"></span>
              <span>Chưa chọn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-400"></span>
              <span>Đánh dấu xem lại</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm ring-2 ring-indigo-500"></span>
              <span>Đang xem</span>
            </div>
          </div>

          {/* Grid buttons */}
          <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[300px] pr-1">
            {examQuestions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isFlagged = flaggedQuestions.has(idx);
              const isCurrent = idx === currentIndex;

              let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
              if (isAnswered) {
                btnStyle = 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-2xs';
              }
              if (isFlagged) {
                btnStyle = 'bg-amber-400 text-amber-950 font-bold border-amber-500 ring-2 ring-amber-300';
              }
              if (isCurrent) {
                btnStyle += ' ring-2 ring-offset-2 ring-indigo-500';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentIndex(idx);
                  }}
                  className={`h-9 rounded-lg text-xs font-semibold border flex items-center justify-center transition cursor-pointer relative ${btnStyle}`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
            >
              Nộp bài thi ngay
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Bạn có chắc muốn nộp bài?
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Bạn đã trả lời <strong className="text-indigo-600">{answeredCount}/{examQuestions.length}</strong> câu hỏi.
              {examQuestions.length - answeredCount > 0 && (
                <span className="text-rose-600 block mt-1">
                  Còn {examQuestions.length - answeredCount} câu chưa trả lời!
                </span>
              )}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
              >
                Tiếp tục làm
              </button>
              <button
                onClick={handleSubmitExam}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm"
              >
                Xác nhận nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
