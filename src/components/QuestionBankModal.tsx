import React, { useState } from 'react';
import { X, Search, Filter, BookOpen, Trash2, Plus, Download, RotateCcw } from 'lucide-react';
import { Question } from '../types';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  categories: string[];
  onDeleteCustomQuestion?: (id: string) => void;
  onResetToDefault: () => void;
  onDownloadHtml: () => void;
  onOpenAddModal: () => void;
}

export default function QuestionBankModal({
  isOpen,
  onClose,
  questions,
  categories,
  onDeleteCustomQuestion,
  onResetToDefault,
  onDownloadHtml,
  onOpenAddModal,
}: QuestionBankModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('Tất cả chủ đề');

  if (!isOpen) return null;

  const filtered = questions.filter(q => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat =
      selectedCat === 'Tất cả chủ đề' || q.category === selectedCat;

    return matchesSearch && matchesCat;
  });

  const prefixes = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">
                Kho Câu Hỏi Lịch Sử
              </h3>
              <p className="text-xs text-slate-500">
                Tổng cộng {questions.length} câu hỏi chuẩn kiến thức
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters & Actions Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi, sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Category Select */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-700 focus:outline-hidden"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <button
              onClick={() => {
                onClose();
                onOpenAddModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm mới</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-medium">Không tìm thấy câu hỏi phù hợp.</p>
            </div>
          ) : (
            filtered.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {q.category}
                    </span>
                    {q.isCustom && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Người dùng tạo
                      </span>
                    )}
                  </div>

                  {q.isCustom && onDeleteCustomQuestion && (
                    <button
                      onClick={() => onDeleteCustomQuestion(q.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition"
                      title="Xóa câu hỏi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="font-semibold text-slate-800 text-sm mb-3">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-lg border flex items-center gap-2 ${
                        oIdx === q.correct
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-md bg-white text-center font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200">
                        {prefixes[oIdx]}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong className="text-slate-700">Giải thích:</strong> {q.explanation}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <button
            onClick={onResetToDefault}
            className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định ban đầu</span>
          </button>

          <button
            onClick={onDownloadHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-indigo-700 font-semibold rounded-xl shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải file HTML độc lập</span>
          </button>
        </div>

      </div>
    </div>
  );
}
