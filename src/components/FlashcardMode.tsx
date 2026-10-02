import React, { useState } from 'react';
import { RotateCw, Check, X, ArrowLeft, ArrowRight, Lightbulb, Sparkles, Shuffle } from 'lucide-react';
import { Question } from '../types';
import { soundManager } from '../utils/audio';

interface FlashcardModeProps {
  questions: Question[];
}

export default function FlashcardMode({ questions }: FlashcardModeProps) {
  const [deck, setDeck] = useState<Question[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const currentCard = deck[currentIndex] || deck[0];
  const isMastered = currentCard && masteredIds.has(currentCard.id);

  const handleFlip = () => {
    soundManager.playClick();
    setIsFlipped(prev => !prev);
  };

  const handleNext = () => {
    soundManager.playClick();
    setIsFlipped(false);
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    soundManager.playClick();
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(deck.length - 1);
    }
  };

  const markMastered = () => {
    soundManager.playCorrect();
    setMasteredIds(prev => new Set(prev).add(currentCard.id));
    handleNext();
  };

  const markNeedsReview = () => {
    soundManager.playWrong();
    setMasteredIds(prev => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  };

  const handleShuffle = () => {
    soundManager.playClick();
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!currentCard) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl max-w-md mx-auto border border-slate-200">
        <p className="text-slate-600">Chưa có câu hỏi nào để tạo flashcard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl w-full mx-auto">
      {/* Top flashcard stats */}
      <div className="flex items-center justify-between mb-4 px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200">
            Thẻ {currentIndex + 1} / {deck.length}
          </span>
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
            Đã thuộc: {masteredIds.size}
          </span>
        </div>

        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-full border border-slate-200 transition font-medium cursor-pointer shadow-2xs"
          title="Xáo trộn thứ tự thẻ"
        >
          <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
          <span>Xáo trộn thẻ</span>
        </button>
      </div>

      {/* Flip Card Container */}
      <div
        onClick={handleFlip}
        className="cursor-pointer perspective-1000 min-h-[360px] sm:min-h-[400px] select-none"
      >
        <div
          className={`relative w-full h-full rounded-3xl p-6 sm:p-8 transition-all duration-500 shadow-xl border ${
            isFlipped
              ? 'bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border-indigo-700 shadow-indigo-500/10'
              : 'bg-white text-slate-800 border-slate-200 shadow-slate-200/60 hover:border-indigo-300'
          }`}
        >
          {/* Card Top indicator */}
          <div className="flex items-center justify-between mb-6">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                isFlipped
                  ? 'bg-indigo-800/80 text-indigo-200'
                  : 'bg-indigo-50 text-indigo-700'
              }`}
            >
              {currentCard.category}
            </span>

            <span className="text-xs flex items-center gap-1 opacity-70">
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Mặt sau (Đáp án)' : 'Nhấn để lật đáp án'}</span>
            </span>
          </div>

          {/* Card Content */}
          <div className="flex flex-col justify-center items-center text-center my-6 min-h-[180px]">
            {!isFlipped ? (
              // FRONT OF CARD
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-500 font-bold mb-2 block">
                  Câu hỏi sự kiện
                </span>
                <h3 className="text-lg sm:text-2xl font-bold leading-relaxed max-w-md mx-auto">
                  {currentCard.question}
                </h3>
                {currentCard.period && (
                  <p className="text-xs text-slate-400 mt-4">
                    Gợi ý thời kỳ: {currentCard.period}
                  </p>
                )}
              </div>
            ) : (
              // BACK OF CARD
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-2 block">
                  Đáp án chính xác
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mb-4 bg-emerald-950/40 border border-emerald-500/30 px-5 py-3 rounded-2xl inline-block">
                  {currentCard.options[currentCard.correct]}
                </div>
                <div className="text-sm text-slate-200 max-w-md mx-auto leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10 text-left">
                  <p className="font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>Ý nghĩa & Lời giải:</span>
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm">
                    {currentCard.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer of Card */}
          <div className="text-center pt-4 border-t border-slate-100 dark:border-white/10 text-xs opacity-60">
            {isMastered ? (
              <span className="text-emerald-400 font-semibold">✓ Đã đánh dấu thuộc thẻ này</span>
            ) : (
              <span>Chạm hoặc nhấn vào thẻ để đổi mặt</span>
            )}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-3 mt-6">
        <button
          onClick={handlePrev}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 shadow-2xs transition cursor-pointer"
          title="Thẻ trước"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 flex-1 justify-center">
          <button
            onClick={markNeedsReview}
            className="flex-1 max-w-[140px] flex items-center justify-center gap-1.5 py-3 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs sm:text-sm rounded-2xl border border-rose-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Chưa thuộc</span>
          </button>

          <button
            onClick={markMastered}
            className="flex-1 max-w-[140px] flex items-center justify-center gap-1.5 py-3 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs sm:text-sm rounded-2xl border border-emerald-200 transition cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Đã thuộc</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 shadow-2xs transition cursor-pointer"
          title="Thẻ tiếp theo"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
