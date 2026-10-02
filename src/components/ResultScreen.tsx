import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, CheckCircle2, XCircle, Lightbulb, ArrowLeft, Filter, Download, Trash2, Calendar, History } from 'lucide-react';
import { Question, QuizRecord } from '../types';
import { soundManager } from '../utils/audio';
import Confetti from './Confetti';

interface ResultScreenProps {
  score: number;
  total: number;
  answers: {
    question: Question;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
  onRestart: () => void;
  onBackToHome: () => void;
  onDownloadHtml: () => void;
  historyRecords: QuizRecord[];
  onClearHistory: () => void;
}

export default function ResultScreen({
  score,
  total,
  answers,
  onRestart,
  onBackToHome,
  onDownloadHtml,
  historyRecords,
  onClearHistory,
}: ResultScreenProps) {
  const [filterType, setFilterType] = useState<'all' | 'wrong' | 'correct'>('all');
  const percentage = Math.round((score / total) * 100) || 0;
  const grade10 = ((score / total) * 10).toFixed(1);
  const prefixes = ['A', 'B', 'C', 'D'];

  const isHighScore = percentage >= 80;

  useEffect(() => {
    if (isHighScore) {
      soundManager.playVictory();
    }
  }, [isHighScore]);

  let evaluation = {
    title: 'Cần Cố Gắng Hơn!',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    description: 'Hãy ôn lại các mốc sự kiện quan trọng và thử lại lần nữa nhé!',
    emoji: '📚'
  };

  if (percentage >= 90) {
    evaluation = {
      title: 'Xuất Sắc Tuyệt Đối!',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Kiến thức Lịch sử của bạn vô cùng vững vàng!',
      emoji: '🏆'
    };
  } else if (percentage >= 75) {
    evaluation = {
      title: 'Kết Quả Rất Tốt!',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Bạn nắm rất chắc các sự kiện và nhân vật lịch sử cốt lõi.',
      emoji: '🌟'
    };
  } else if (percentage >= 50) {
    evaluation = {
      title: 'Đạt Yêu Cầu!',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Đã hoàn thành bài thi với kết quả khá, xem lại các câu sai để nhớ sâu hơn.',
      emoji: '👍'
    };
  }

  const filteredAnswers = answers.filter((item) => {
    if (filterType === 'wrong') return !item.isCorrect;
    if (filterType === 'correct') return item.isCorrect;
    return true;
  });

  const wrongCount = total - score;

  return (
    <div className="max-w-2xl w-full mx-auto pb-12">
      {isHighScore && <Confetti />}

      {/* Main Score Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 text-center mb-6">
        <div className={`w-20 h-20 ${evaluation.bgColor} rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner`}>
          {evaluation.emoji}
        </div>

        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${evaluation.bgColor} ${evaluation.color} inline-block mb-2`}>
          {evaluation.title}
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
          Hoàn Thành Bài Tập!
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
          Kết quả lượt làm hiện tại của bạn:
        </p>

        {/* Current Score Highlights Box (as in updated HTML) */}
        <div className="bg-indigo-50/80 border border-indigo-100 p-5 rounded-2xl max-w-xs mx-auto mb-6 shadow-2xs">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Kết quả của bạn</p>
          <p className="text-4xl font-extrabold text-indigo-600 mt-1">
            {score}/{total}
          </p>
          <p className="text-sm font-semibold text-indigo-500 mt-1">
            ({percentage}% chính xác • Điểm {grade10}/10)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <button
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại bài tập (Xáo trộn mới)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onBackToHome();
            }}
            className="w-full sm:w-auto px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Đổi chủ đề / Chế độ</span>
          </button>

          <button
            onClick={onDownloadHtml}
            className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer text-sm"
            title="Tải bài tập dưới dạng file HTML độc lập"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Tải file HTML</span>
          </button>
        </div>

        {/* Lịch sử làm bài trước (Section exactly requested) */}
        <div className="border-t border-slate-100 pt-5 text-left">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span>📜</span> Lịch sử cá nhân (trên thiết bị này)
            </h3>
            {historyRecords.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Xóa toàn bộ lịch sử trên máy này?")) {
                    onClearHistory();
                  }
                }}
                className="text-xs text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa lịch sử</span>
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1 text-sm">
            {historyRecords.length === 0 ? (
              <p className="text-center text-slate-400 py-4 italic text-xs">
                Chưa có lịch sử làm bài trước đó.
              </p>
            ) : (
              historyRecords.map((record, index) => (
                <div
                  key={record.id || index}
                  className="flex justify-between items-center bg-slate-50 hover:bg-slate-100/70 p-3 rounded-xl border border-slate-200/70 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 text-xs sm:text-sm">
                      Lần {historyRecords.length - index}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{record.date}</span>
                    </span>
                    {record.mode && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600">
                        {record.mode === 'exam' ? 'Thi thử' : 'Luyện tập'}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-indigo-600 text-sm">
                      {record.score}/{record.total}
                    </span>
                    <span className={`text-xs font-semibold ml-1.5 ${
                      record.percentage >= 80 ? 'text-emerald-600' :
                      record.percentage >= 50 ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      ({record.percentage}%)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Detailed Review Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-lg text-slate-800">
              Xem Lại Chi Tiết Từng Câu
            </h3>
            <p className="text-xs text-slate-500">
              Phân tích đáp án đúng và giải thích lịch sử đi kèm
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === 'all'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({total})
            </button>
            <button
              onClick={() => setFilterType('wrong')}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === 'wrong'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sai ({wrongCount})
            </button>
            <button
              onClick={() => setFilterType('correct')}
              className={`px-3 py-1 rounded-lg transition ${
                filterType === 'correct'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đúng ({score})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredAnswers.map((item, index) => {
            const { question, selectedIndex, isCorrect } = item;
            return (
              <div
                key={question.id || index}
                className={`p-4 sm:p-5 rounded-2xl border transition ${
                  isCorrect
                    ? 'border-emerald-200/80 bg-emerald-50/20'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <span className="font-bold text-sm text-slate-800">
                      Câu {answers.indexOf(item) + 1}
                    </span>
                    <span className="text-xs text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                      {question.category}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isCorrect ? 'Đúng (+1đ)' : 'Chưa đúng'}
                  </span>
                </div>

                <p className="font-semibold text-slate-800 text-sm sm:text-base mb-3 leading-snug">
                  {question.question}
                </p>

                {/* Options List */}
                <div className="space-y-1.5 mb-3 text-xs sm:text-sm">
                  {question.options.map((opt, optIdx) => {
                    const isCorrectAnswer = optIdx === question.correct;
                    const isUserChoice = optIdx === selectedIndex;

                    let optClass = 'text-slate-600 bg-white/70 border-slate-200';
                    if (isCorrectAnswer) {
                      optClass = 'bg-emerald-100/80 border-emerald-500 text-emerald-900 font-semibold';
                    } else if (isUserChoice && !isCorrect) {
                      optClass = 'bg-rose-100/80 border-rose-400 text-rose-900 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${optClass}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-white text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 border border-slate-200">
                            {prefixes[optIdx]}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isCorrectAnswer && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                            Đáp án đúng
                          </span>
                        )}
                        {isUserChoice && !isCorrect && (
                          <span className="text-[11px] font-bold text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-300">
                            Bạn đã chọn
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="bg-white p-3 rounded-xl border border-blue-200 text-xs text-slate-700">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Giải thích chi tiết:</span>
                  </span>
                  <p className="leading-relaxed text-slate-600 pl-5">
                    {question.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
