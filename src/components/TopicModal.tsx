import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { Topic, Question } from '../types';
import { parseTextToQuestions, convertQuestionsToText, SAMPLE_PLAIN_TEXT_QUIZ } from '../utils/textParser';

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTopic: (topicData: { id?: string; title: string; questions: Question[] }) => void;
  editingTopic: Topic | null; // null if adding new, Topic if editing
}

export default function TopicModal({
  isOpen,
  onClose,
  onSaveTopic,
  editingTopic,
}: TopicModalProps) {
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(editingTopic);

  useEffect(() => {
    if (editingTopic) {
      setTitle(editingTopic.title);
      setTextContent(convertQuestionsToText(editingTopic.questions));
      setError(null);
    } else {
      setTitle('');
      setTextContent('');
      setError(null);
    }
  }, [editingTopic, isOpen]);

  if (!isOpen) return null;

  const handleInsertSample = () => {
    setTitle('Ví Dụ Mẫu');
    setTextContent(SAMPLE_PLAIN_TEXT_QUIZ);
    setError(null);
  };

  const detectedQuestions = () => {
    if (!textContent.trim()) return [];
    try {
      // Check if user pasted JSON
      if (textContent.trim().startsWith('[')) {
        const parsed = JSON.parse(textContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => ({
            id: `q-${Date.now()}-${idx}`,
            question: item.question,
            options: item.options,
            correct: typeof item.correct === 'number' ? item.correct : 0,
            explanation: item.explanation || 'Không có giải thích chi tiết.',
            category: title.trim() || 'Chủ đề',
            isCustom: true,
          }));
        }
      }
    } catch {
      // fallback to plain text parser
    }
    return parseTextToQuestions(textContent, title.trim() || 'Chủ đề');
  };

  const handleSave = () => {
    setError(null);
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Vui lòng nhập tên chủ đề!');
      return;
    }

    if (!textContent.trim()) {
      setError('Vui lòng nhập nội dung câu hỏi!');
      return;
    }

    const parsedQuestions = detectedQuestions();

    if (parsedQuestions.length === 0) {
      setError(
        'Không nhận diện được câu hỏi nào! Hãy kiểm tra lại định dạng (mỗi câu cần có câu hỏi, các đáp án A, B, C, D và dòng "Đáp án: A/B/C/D").'
      );
      return;
    }

    onSaveTopic({
      id: editingTopic?.id,
      title: cleanTitle,
      questions: parsedQuestions,
    });

    onClose();
  };

  const qCount = detectedQuestions().length;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>{isEditing ? '✏️' : '➕'}</span>
              <span>{isEditing ? 'Chỉnh Sửa Chủ Đề' : 'Thêm Chủ Đề Mới'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dán danh sách câu hỏi theo định dạng đơn giản bên dưới.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 py-4 overflow-y-auto pr-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên chủ đề: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Tiếng Anh Bài 1, Lịch Sử 12..."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Nội dung câu hỏi:
              </label>
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleInsertSample}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Dán mẫu ví dụ</span>
                </button>
              )}
            </div>

            <textarea
              rows={11}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder={`1. Chiến thắng Điện Biên Phủ diễn ra năm nào?\nA. 1945\nB. 1954\nC. 1968\nD. 1975\nĐáp án: B\nGiải thích: Ngày 7/5/1954.`}
              className="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-1">
              <span>Cách mỗi câu hỏi bằng 1 dòng trống</span>
              {qCount > 0 ? (
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Đã nhận diện {qCount} câu hỏi
                </span>
              ) : (
                <span className="text-slate-400">Chưa nhận diện câu hỏi</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            {qCount > 0 ? `Sẵn sàng lưu ${qCount} câu hỏi` : ''}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition"
            >
              Lưu chủ đề
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
