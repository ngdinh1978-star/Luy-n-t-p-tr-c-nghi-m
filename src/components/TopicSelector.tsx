import React from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { Topic } from '../types';

interface TopicSelectorProps {
  topics: Topic[];
  currentTopicId: string;
  onChangeTopic: (topicId: string) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: () => void;
  onDeleteTopic: (topicId: string) => void;
  sourceTag: string;
}

export default function TopicSelector({
  topics,
  currentTopicId,
  onChangeTopic,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteTopic,
  sourceTag,
}: TopicSelectorProps) {
  const hasTopics = topics.length > 0;

  return (
    <div className="max-w-2xl mx-auto w-full mb-4">
      {/* QUẢN LÝ CHỦ ĐỀ */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label
              htmlFor="topic-select"
              className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center gap-1"
            >
              <span>📌</span> Chủ đề:
            </label>
            <select
              id="topic-select"
              value={hasTopics ? currentTopicId : ''}
              disabled={!hasTopics}
              onChange={(e) => onChangeTopic(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold w-full sm:w-auto cursor-pointer outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {hasTopics ? (
                topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.title} ({topic.questions.length} câu)
                  </option>
                ))
              ) : (
                <option value="">-- Trống --</option>
              )}
            </select>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={onOpenAddModal}
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 cursor-pointer shadow-xs"
              title="Tạo chủ đề mới"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>➕ Thêm mới</span>
            </button>

            {hasTopics && (
              <>
                <button
                  id="edit-btn"
                  onClick={onOpenEditModal}
                  className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 cursor-pointer shadow-xs"
                  title="Chỉnh sửa nội dung câu hỏi của chủ đề này"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>✏️ Sửa</span>
                </button>

                <button
                  id="delete-btn"
                  onClick={() => onDeleteTopic(currentTopicId)}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="Xóa chủ đề này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>🗑️ Xóa</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Thông báo nguồn câu hỏi */}
      <p id="quiz-source-tag" className="text-xs text-indigo-600 font-medium text-center mt-2">
        {hasTopics ? sourceTag : 'Chưa có chủ đề nào...'}
      </p>
    </div>
  );
}
