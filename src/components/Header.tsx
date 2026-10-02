import React, { useRef } from 'react';
import { BookOpen, Clock, Layers, Volume2, VolumeX, Download, PlusCircle, Database, History, Upload, RotateCcw, FileText } from 'lucide-react';
import { QuizModeType } from '../types';
import { soundManager } from '../utils/audio';
import { downloadSampleJsonTemplate } from '../utils/exportHtml';

interface HeaderProps {
  currentMode: QuizModeType;
  onSelectMode: (mode: QuizModeType) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenQuestionBank: () => void;
  onOpenAddQuestion: () => void;
  onDownloadHtml: () => void;
  bookmarkedCount: number;
  totalQuestions: number;
  totalAttempts: number;
  mobileAttempts: number;
  onOpenHistory: () => void;
  onUploadJson: (file: File) => void;
  isCustomLoaded: boolean;
  onResetDefaultQuiz: () => void;
  quizSourceTag: string;
}

export default function Header({
  currentMode,
  onSelectMode,
  soundEnabled,
  onToggleSound,
  onOpenQuestionBank,
  onOpenAddQuestion,
  onDownloadHtml,
  bookmarkedCount,
  totalQuestions,
  totalAttempts,
  mobileAttempts,
  onOpenHistory,
  onUploadJson,
  isCustomLoaded,
  onResetDefaultQuiz,
  quizSourceTag,
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadJson(file);
    }
    e.target.value = '';
  };

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Logo & Brand & Attempts */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full md:w-auto gap-2">
            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-lg text-slate-800 tracking-tight">
                      Ứng Dụng Trắc Nghiệm Ôn Tập
                    </h1>
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">
                      Ôn Luyện
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Tự tạo và quản lý bộ câu hỏi ôn tập cá nhân
                  </p>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex md:hidden items-center gap-1.5">
                <button
                  onClick={onOpenHistory}
                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 border border-slate-200"
                  title="Xem lịch sử làm bài"
                >
                  <History className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-bold">{totalAttempts}</span>
                </button>
                <button
                  onClick={onToggleSound}
                  className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                  title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                </button>
                <button
                  onClick={onDownloadHtml}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  title="Tải file HTML đơn lẻ"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Attempts Pill Badges */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={onOpenHistory}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-3 py-1 rounded-full text-xs font-medium text-slate-600 border border-slate-200/80 transition cursor-pointer"
                title="Tổng lượt làm toàn hệ thống"
              >
                <span>🌐 Tổng lượt làm:</span>
                <span className="font-bold text-indigo-600">{totalAttempts}</span>
              </button>

              <div
                className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-xs font-medium text-emerald-700"
                title="Lượt làm từ thiết bị di động"
              >
                <span>📱 Từ điện thoại:</span>
                <span className="font-bold text-emerald-600">{mobileAttempts}</span>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium w-full md:w-auto justify-center">
            <button
              onClick={() => {
                soundManager.playClick();
                onSelectMode('practice');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentMode === 'practice'
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Luyện tập</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectMode('exam');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentMode === 'exam'
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Thi thử</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onSelectMode('flashcard');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentMode === 'flashcard'
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcard</span>
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-2">
            {/* JSON Upload & Reset */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition cursor-pointer"
              title="Tải tệp JSON chứa câu hỏi trắc nghiệm của bạn"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tải JSON</span>
            </button>

            {isCustomLoaded && (
              <button
                onClick={onResetDefaultQuiz}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition cursor-pointer"
                title="Quay lại bộ câu hỏi mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span>Đề mặc định</span>
              </button>
            )}

            <button
              onClick={onOpenQuestionBank}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-100/80 hover:bg-slate-200/70 rounded-lg transition cursor-pointer"
              title="Xem kho câu hỏi"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Kho ({totalQuestions})</span>
            </button>

            <button
              onClick={onToggleSound}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title={soundEnabled ? 'Âm thanh: Đang bật' : 'Âm thanh: Đang tắt'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <button
              onClick={onDownloadHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200/80 transition cursor-pointer"
              title="Tải mã nguồn file HTML độc lập"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất HTML</span>
            </button>
          </div>

        </div>

        {/* Source tag & Sample template download sub-bar */}
        <div className="flex flex-wrap items-center justify-between pt-2 mt-1 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-indigo-600">
              {quizSourceTag}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={downloadSampleJsonTemplate}
              className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition"
              title="Tải file JSON mẫu cấu trúc câu hỏi"
            >
              <FileText className="w-3 h-3 text-slate-400" />
              <span>Tải file JSON mẫu</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
