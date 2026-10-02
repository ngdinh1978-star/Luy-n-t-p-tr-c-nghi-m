import React from 'react';
import { X, Trash2, Calendar, Award, CheckCircle, TrendingUp, History } from 'lucide-react';
import { QuizRecord } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: QuizRecord[];
  onClearHistory: () => void;
}

export default function HistoryModal({
  isOpen,
  onClose,
  records,
  onClearHistory,
}: HistoryModalProps) {
  if (!isOpen) return null;

  const averagePercentage = records.length > 0
    ? Math.round(records.reduce((acc, r) => acc + r.percentage, 0) / records.length)
    : 0;

  const highestScoreRecord = records.length > 0
    ? [...records].sort((a, b) => b.percentage - a.percentage)[0]
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">
                Lịch Sử Cá Nhân (Trên Máy Này)
              </h3>
              <p className="text-xs text-slate-500">
                Tổng cộng {records.length} lượt đã hoàn thành trên thiết bị này
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats summary bar */}
        {records.length > 0 && (
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Tỷ lệ trung bình
              </span>
              <span className="text-xl font-bold text-indigo-600 mt-0.5 inline-block">
                {averagePercentage}%
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Điểm cao nhất
              </span>
              <span className="text-xl font-bold text-emerald-600 mt-0.5 inline-block">
                {highestScoreRecord ? `${highestScoreRecord.percentage}%` : '0%'}
              </span>
            </div>
          </div>
        )}

        {/* List of attempts */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 my-2">
          {records.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Chưa có lịch sử làm bài nào.</p>
              <p className="text-xs mt-1">Hãy bắt đầu làm một bài luyện tập hoặc thi thử!</p>
            </div>
          ) : (
            records.map((record, index) => (
              <div
                key={record.id || index}
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-800">
                      Lần {records.length - index}
                    </span>
                    {record.mode && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {record.mode === 'exam' ? 'Thi thử' : 'Luyện tập'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{record.date}</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-indigo-600">
                    {record.score}/{record.total}
                  </span>
                  <span className={`block text-xs font-semibold ${
                    record.percentage >= 80 ? 'text-emerald-600' :
                    record.percentage >= 50 ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {record.percentage}% chính xác
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {records.length > 0 && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử làm bài?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 cursor-pointer p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ lịch sử</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
