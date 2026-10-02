import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { Question } from '../types';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (newQuestion: Question) => void;
  categories: string[];
}

export default function AddQuestionModal({
  isOpen,
  onClose,
  onAddQuestion,
  categories,
}: AddQuestionModalProps) {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [category, setCategory] = useState(categories[1] || 'Kháng chiến chống Pháp');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const prefixes = ['A', 'B', 'C', 'D'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setError('Vui lòng nhập nội dung câu hỏi.');
      return;
    }

    if (options.some(opt => !opt.trim())) {
      setError('Vui lòng điền đầy đủ cả 4 phương án trả lời.');
      return;
    }

    if (!explanation.trim()) {
      setError('Vui lòng nhập phần giải thích chi tiết.');
      return;
    }

    const newQ: Question = {
      id: 'custom-' + Date.now(),
      question: questionText.trim(),
      options: options.map(o => o.trim()),
      correct: correctIndex,
      explanation: explanation.trim(),
      category,
      difficulty: 'Trung bình',
      isCustom: true
    };

    onAddQuestion(newQ);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[92vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 className="font-bold text-lg text-slate-800">
            Thêm Câu Hỏi Lịch Sử Mới
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Question Text */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nội dung câu hỏi:
            </label>
            <textarea
              required
              rows={3}
              value={questionText}
              onChange={(e) => {
                setQuestionText(e.target.value);
                setError('');
              }}
              placeholder="Ví dụ: Chiến dịch Điện Biên Phủ diễn ra vào năm nào?"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Chủ đề:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
            >
              {categories.filter(c => c !== 'Tất cả chủ đề').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Options */}
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              4 Phương án trả lời (chọn nút tròn để đánh dấu đáp án đúng):
            </label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct-option"
                    id={`opt-${i}`}
                    checked={correctIndex === i}
                    onChange={() => setCorrectIndex(i)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor={`opt-${i}`} className="w-6 font-bold text-slate-600 text-xs text-center">
                    {prefixes[i]}
                  </label>
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[i] = e.target.value;
                      setOptions(newOpts);
                      setError('');
                    }}
                    placeholder={`Đáp án ${prefixes[i]}`}
                    className={`flex-1 p-2.5 border rounded-xl bg-slate-50 text-xs sm:text-sm focus:outline-hidden ${
                      correctIndex === i ? 'border-emerald-400 bg-emerald-50/40' : 'border-slate-200'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              💡 Giải thích chi tiết & ý nghĩa sự kiện:
            </label>
            <textarea
              required
              rows={2}
              value={explanation}
              onChange={(e) => {
                setExplanation(e.target.value);
                setError('');
              }}
              placeholder="Giải thích tại sao đáp án này đúng và ý nghĩa lịch sử..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold cursor-pointer shadow-sm"
            >
              Lưu câu hỏi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
