import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import PracticeMode from './components/PracticeMode';
import ExamMode from './components/ExamMode';
import FlashcardMode from './components/FlashcardMode';
import ResultScreen from './components/ResultScreen';
import QuestionBankModal from './components/QuestionBankModal';
import AddQuestionModal from './components/AddQuestionModal';
import HistoryModal from './components/HistoryModal';
import TopicModal from './components/TopicModal';
import TopicSelector from './components/TopicSelector';
import { INITIAL_QUIZ_DATA, CATEGORIES, DEFAULT_TOPICS } from './data/quizData';
import { Question, QuizModeType, QuizRecord, Topic } from './types';
import { soundManager } from './utils/audio';
import { downloadStandaloneHtmlFile } from './utils/exportHtml';
import { isMobileDevice } from './utils/device';
import { Bookmark, Sparkles, BookOpen, Clock, Layers, Award, CheckCircle, History, Upload, RotateCcw, Smartphone } from 'lucide-react';

export default function App() {
  // Multi-topics state management
  const [topics, setTopics] = useState<Topic[]>(() => {
    try {
      const saved = localStorage.getItem('quiz_app_topics') || localStorage.getItem('quiz_custom_topics');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'topic_sample',
        title: 'Ví Dụ Mẫu',
        questions: [
          {
            id: 'sample_1',
            question: 'Thủ đô của Việt Nam là gì?',
            options: ['TP. Hồ Chí Minh', 'Đà Nẵng', 'Hà Nội', 'Cần Thơ'],
            correct: 2,
            explanation: 'Hà Nội là thủ đô chính thức của Việt Nam.',
            category: 'Ví Dụ Mẫu'
          },
          {
            id: 'sample_2',
            question: 'Kim loại nào dẫn điện tốt nhất?',
            options: ['Vàng', 'Bạc', 'Đồng', 'Nhôm'],
            correct: 1,
            explanation: 'Bạc dẫn điện tốt nhất trong số các kim loại.',
            category: 'Ví Dụ Mẫu'
          }
        ]
      }
    ];
  });

  const [currentTopicId, setCurrentTopicId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('quiz_active_topic_id');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '';
  });

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  // Active topic & questions
  const activeTopic = useMemo(() => {
    if (topics.length === 0) return null;
    return topics.find(t => t.id === currentTopicId) || topics[0];
  }, [topics, currentTopicId]);

  const questions = activeTopic ? activeTopic.questions : [];

  // Quiz History Records (stored per topic and overall)
  const [historyRecords, setHistoryRecords] = useState<QuizRecord[]>(() => {
    try {
      const saved = localStorage.getItem('history_quiz_records');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('history_quiz_bookmarks');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    return new Set<string>();
  });

  // App Modes & Navigation
  const [currentMode, setCurrentMode] = useState<QuizModeType>('practice');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [questionLimit, setQuestionLimit] = useState(5); // Default to 5
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global attempts count across devices (with fallback persistent count)
  const [globalAttemptsCount, setGlobalAttemptsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fallback_total_count') || localStorage.getItem('fallback_global_count');
      if (saved) return parseInt(saved, 10);
    } catch {
      // ignore
    }
    return 36;
  });

  // Mobile attempts count
  const [mobileAttemptsCount, setMobileAttemptsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('fallback_mobile_count');
      if (saved) return parseInt(saved, 10);
    } catch {
      // ignore
    }
    return 24;
  });

  const [quizSessionKey, setQuizSessionKey] = useState(0);

  // Result Screen state
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    answers: { question: Question; selectedIndex: number; isCorrect: boolean }[];
  } | null>(null);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('history_quiz_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
    } catch {
      // ignore
    }
  }, [bookmarkedIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      soundManager.enabled = next;
      return next;
    });
  };

  const handleToggleBookmark = (id: string) => {
    soundManager.playClick();
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Đã bỏ lưu câu hỏi');
      } else {
        next.add(id);
        showToast('Đã lưu vào danh sách ôn lại ⭐');
      }
      return next;
    });
  };

  // Topic change handler
  const handleChangeTopic = (topicId: string) => {
    soundManager.playClick();
    setCurrentTopicId(topicId);
    try {
      localStorage.setItem('quiz_active_topic_id', topicId);
    } catch {
      // ignore
    }
    setQuizSessionKey(prev => prev + 1);
    setQuizResult(null);
    const found = topics.find(t => t.id === topicId);
    if (found) {
      showToast(`Đã chuyển sang chủ đề: ${found.title}`);
    }
  };

  // Open Add Topic modal
  const handleOpenAddModal = () => {
    setEditingTopic(null);
    setIsTopicModalOpen(true);
  };

  // Open Edit Topic modal
  const handleOpenEditModal = () => {
    setEditingTopic(activeTopic);
    setIsTopicModalOpen(true);
  };

  // Save topic (either new or edited)
  const handleSaveTopic = ({
    id,
    title,
    questions: newQuestions,
  }: {
    id?: string;
    title: string;
    questions: Question[];
  }) => {
    let targetKey = id;
    let updated: Topic[];

    if (id) {
      // Sửa chủ đề hiện có
      updated = topics.map((t) =>
        t.id === id ? { ...t, title, questions: newQuestions } : t
      );
    } else {
      // Thêm chủ đề mới
      targetKey = 'custom_' + Date.now();
      const newTopic: Topic = {
        id: targetKey,
        title,
        description: `Chủ đề với ${newQuestions.length} câu hỏi`,
        questions: newQuestions,
        isDefault: false,
      };
      updated = [...topics, newTopic];
    }

    setTopics(updated);
    try {
      localStorage.setItem('quiz_app_topics', JSON.stringify(updated));
    } catch {
      // ignore
    }

    const nextId = targetKey || (updated.length > 0 ? updated[0].id : '');
    setCurrentTopicId(nextId);
    try {
      localStorage.setItem('quiz_active_topic_id', nextId);
    } catch {
      // ignore
    }

    setQuizSessionKey((prev) => prev + 1);
    setQuizResult(null);
    showToast(`Lưu thành công! Chủ đề "${title}" có ${newQuestions.length} câu hỏi.`);
  };

  // Delete current topic handler
  const handleDeleteCurrentTopic = (topicId: string) => {
    const current = topics.find((t) => t.id === topicId);
    if (!current) return;

    if (window.confirm(`Xóa hẳn chủ đề "${current.title}"?`)) {
      const updated = topics.filter((t) => t.id !== topicId);
      setTopics(updated);
      try {
        localStorage.setItem('quiz_app_topics', JSON.stringify(updated));
      } catch {
        // ignore
      }

      if (updated.length > 0) {
        const nextTopicId = updated[0].id;
        setCurrentTopicId(nextTopicId);
        try {
          localStorage.setItem('quiz_active_topic_id', nextTopicId);
        } catch {
          // ignore
        }
      } else {
        setCurrentTopicId('');
        try {
          localStorage.removeItem('quiz_active_topic_id');
        } catch {
          // ignore
        }
      }

      setQuizSessionKey((prev) => prev + 1);
      setQuizResult(null);
      showToast(`Đã xóa chủ đề "${current.title}".`);
    }
  };

  // Add custom question to active topic
  const handleAddQuestion = (newQ: Question) => {
    if (!activeTopic) return;
    const updatedTopicQuestions = [newQ, ...activeTopic.questions];
    const updatedTopics = topics.map(t =>
      t.id === activeTopic.id ? { ...t, questions: updatedTopicQuestions } : t
    );
    setTopics(updatedTopics);
    try {
      localStorage.setItem('quiz_app_topics', JSON.stringify(updatedTopics));
    } catch {
      // ignore
    }
    setQuizSessionKey(prev => prev + 1);
    showToast('Đã thêm câu hỏi mới vào chủ đề hiện tại!');
  };

  // Delete question from active topic
  const handleDeleteCustomQuestion = (id: string) => {
    if (!activeTopic) return;
    const updatedTopicQuestions = activeTopic.questions.filter(q => q.id !== id);
    const updatedTopics = topics.map(t =>
      t.id === activeTopic.id ? { ...t, questions: updatedTopicQuestions } : t
    );
    setTopics(updatedTopics);
    try {
      localStorage.setItem('quiz_app_topics', JSON.stringify(updatedTopics));
    } catch {
      // ignore
    }
    setQuizSessionKey(prev => prev + 1);
    showToast('Đã xóa câu hỏi tùy chỉnh.');
  };

  const handleResetToDefault = () => {
    try {
      localStorage.removeItem('quiz_custom_topics');
    } catch {
      // ignore
    }
    setTopics(DEFAULT_TOPICS);
    setCurrentTopicId(DEFAULT_TOPICS[0].id);
    setQuizSessionKey(prev => prev + 1);
    showToast('Đã khôi phục bộ chủ đề mặc định.');
  };

  const handleResetDefaultQuiz = () => {
    soundManager.playClick();
    setCurrentTopicId(DEFAULT_TOPICS[0].id);
    setQuizSessionKey(prev => prev + 1);
    setQuizResult(null);
    showToast('Đã chuyển về chủ đề Lịch sử mặc định.');
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);

        if (!Array.isArray(parsed) || parsed.length === 0) {
          alert('File JSON không hợp lệ hoặc không có câu hỏi nào!');
          return;
        }

        const isValid = parsed.every(
          (item: Record<string, unknown>) =>
            typeof item.question === 'string' &&
            Array.isArray(item.options) &&
            item.options.length >= 2 &&
            typeof item.correct === 'number' &&
            item.correct >= 0 &&
            item.correct < item.options.length
        );

        if (!isValid) {
          alert('Cấu trúc file JSON chưa đúng định dạng. Vui lòng kiểm tra lại cấu trúc file mẫu!');
          return;
        }

        const topicTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const formattedQuestions: Question[] = parsed.map((item, idx) => ({
          id: `json-q-${idx}-${Date.now()}`,
          question: item.question,
          options: item.options,
          correct: item.correct,
          explanation: item.explanation || 'Không có giải thích chi tiết cho câu hỏi này.',
          category: item.category || topicTitle,
          difficulty: item.difficulty || 'Trung bình',
          isCustom: true
        }));

        const newTopic: Topic = {
          id: 'topic-' + Date.now(),
          title: topicTitle,
          description: `Nhập từ file ${file.name} (${formattedQuestions.length} câu)`,
          questions: formattedQuestions,
          isDefault: false
        };

        handleSaveTopic({
          title: topicTitle,
          questions: formattedQuestions,
        });
      } catch (err: unknown) {
        const error = err as Error;
        alert('Lỗi khi đọc file JSON: ' + (error?.message || 'Lỗi không xác định'));
      }
    };
    reader.readAsText(file);
  };

  const handleClearHistory = () => {
    if (!activeTopic) return;
    // Clear history for current topic
    const topicKey = `history_quiz_records_${currentTopicId}`;
    try {
      localStorage.removeItem(topicKey);
    } catch {
      // ignore
    }
    const updated = historyRecords.filter(r => r.category !== activeTopic.title);
    setHistoryRecords(updated);
    try {
      localStorage.setItem('history_quiz_records', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast(`Đã xóa lịch sử làm bài của chủ đề "${activeTopic.title}".`);
  };

  // Filtered Questions pool for current session
  const activeQuestions = useMemo(() => {
    let pool = questions;
    if (questionLimit > 0 && pool.length > questionLimit) {
      return pool.slice(0, questionLimit);
    }
    return pool;
  }, [questions, questionLimit]);

  const handleFinishQuiz = (
    score: number,
    answers: { question: Question; selectedIndex: number; isCorrect: boolean }[]
  ) => {
    const totalQ = activeQuestions.length;
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    
    const newRecord: QuizRecord = {
      id: 'rec-' + Date.now(),
      date: timeString,
      score,
      total: totalQ,
      percentage: totalQ > 0 ? Math.round((score / totalQ) * 100) : 0,
      mode: currentMode,
      category: activeTopic ? activeTopic.title : 'Chủ đề',
    };

    const updatedRecords = [newRecord, ...historyRecords];
    setHistoryRecords(updatedRecords);
    try {
      localStorage.setItem('history_quiz_records', JSON.stringify(updatedRecords));
      const topicKey = `history_quiz_records_${currentTopicId}`;
      const topicHistory = [newRecord, ...(JSON.parse(localStorage.getItem(topicKey) || '[]'))];
      localStorage.setItem(topicKey, JSON.stringify(topicHistory));
    } catch {
      // ignore
    }

    setGlobalAttemptsCount(prev => {
      const next = prev + 1;
      try {
        localStorage.setItem('fallback_total_count', next.toString());
      } catch {
        // ignore
      }
      return next;
    });

    if (isMobileDevice()) {
      setMobileAttemptsCount(prev => {
        const next = prev + 1;
        try {
          localStorage.setItem('fallback_mobile_count', next.toString());
        } catch {
          // ignore
        }
        return next;
      });
    }

    setQuizResult({
      score,
      total: totalQ,
      answers,
    });
  };

  const handleRestartQuiz = () => {
    setQuizSessionKey(prev => prev + 1);
    setQuizResult(null);
  };

  const handleDownloadStandalone = () => {
    soundManager.playClick();
    downloadStandaloneHtmlFile(questions, topics);
    showToast('Đang tải file quiz_app_multi_topics.html về máy!');
  };

  // Filter history records for current topic in ResultScreen
  const currentTopicHistory = useMemo(() => {
    if (!activeTopic) return historyRecords;
    const byCategory = historyRecords.filter(r => r.category === activeTopic.title);
    return byCategory.length > 0 ? byCategory : historyRecords;
  }, [historyRecords, activeTopic]);

  const sourceTag = activeTopic
    ? `Chủ đề: ${activeTopic.title} (${activeTopic.questions.length} câu hỏi)`
    : 'Chưa có chủ đề nào...';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 flex flex-col font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 animate-in fade-in slide-from-bottom-3 duration-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          setQuizResult(null);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenQuestionBank={() => setIsBankModalOpen(true)}
        onOpenAddQuestion={() => setIsAddModalOpen(true)}
        onDownloadHtml={handleDownloadStandalone}
        bookmarkedCount={bookmarkedIds.size}
        totalQuestions={questions.length}
        totalAttempts={globalAttemptsCount}
        mobileAttempts={mobileAttemptsCount}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onUploadJson={handleFileUpload}
        isCustomLoaded={activeTopic ? !activeTopic.isDefault : false}
        onResetDefaultQuiz={handleResetDefaultQuiz}
        quizSourceTag={sourceTag}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col justify-center">
        {quizResult ? (
          <ResultScreen
            score={quizResult.score}
            total={quizResult.total}
            answers={quizResult.answers}
            onRestart={handleRestartQuiz}
            onBackToHome={() => {
              setQuizResult(null);
              setCurrentMode('practice');
            }}
            onDownloadHtml={handleDownloadStandalone}
            historyRecords={currentTopicHistory}
            onClearHistory={handleClearHistory}
          />
        ) : (
          <>
            {/* Top Widget Bar with Global Counters */}
            <div className="max-w-2xl mx-auto w-full mb-3 text-center">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Thống kê tổng lượt làm */}
                <button
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 border border-slate-200 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                  title="Nhấn để xem chi tiết lịch sử cá nhân"
                >
                  <span>🌐 Tổng lượt làm:</span>
                  <span className="font-bold text-indigo-600">{globalAttemptsCount}</span>
                </button>

                {/* Thống kê lượt làm từ điện thoại */}
                <div
                  className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full text-xs font-medium text-emerald-700 shadow-2xs"
                  title="Lượt làm từ thiết bị di động"
                >
                  <span>📱 Từ điện thoại:</span>
                  <span className="font-bold text-emerald-600">{mobileAttemptsCount}</span>
                </div>
              </div>
            </div>

            {/* Topic Selector Bar (Choose topic, add topic, edit topic, delete topic) */}
            <TopicSelector
              topics={topics}
              currentTopicId={currentTopicId}
              onChangeTopic={handleChangeTopic}
              onOpenAddModal={handleOpenAddModal}
              onOpenEditModal={handleOpenEditModal}
              onDeleteTopic={handleDeleteCurrentTopic}
              sourceTag={sourceTag}
            />

            {/* Trạng thái chưa có chủ đề nào */}
            {!activeTopic || topics.length === 0 ? (
              <div
                id="empty-state"
                className="text-center py-12 bg-white rounded-2xl border border-slate-200/90 shadow-md p-8 max-w-lg mx-auto w-full animate-in fade-in"
              >
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                  📝
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Chưa có chủ đề nào!</h3>
                <p className="text-sm text-slate-500 mb-5">
                  Hãy tạo chủ đề đầu tiên bằng cách dán danh sách câu hỏi của bạn.
                </p>
                <button
                  onClick={handleOpenAddModal}
                  className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm px-4 py-2.5 rounded-xl font-semibold transition cursor-pointer shadow-xs"
                >
                  ➕ Thêm chủ đề mới ngay
                </button>
              </div>
            ) : (
              <>
                {/* Mode Content */}
                {currentMode === 'practice' && (
                  <PracticeMode
                    key={quizSessionKey}
                    questions={activeQuestions}
                    onFinishQuiz={handleFinishQuiz}
                    bookmarkedIds={bookmarkedIds}
                    onToggleBookmark={handleToggleBookmark}
                    categories={[activeTopic.title]}
                    selectedCategory={activeTopic.title}
                    onSelectCategory={() => {}}
                    questionLimit={questionLimit}
                    onChangeQuestionLimit={setQuestionLimit}
                  />
                )}

                {currentMode === 'exam' && (
                  <ExamMode
                    key={quizSessionKey}
                    questions={activeQuestions}
                    onFinishExam={handleFinishQuiz}
                    examDurationMinutes={10}
                  />
                )}

                {currentMode === 'flashcard' && (
                  <FlashcardMode questions={activeQuestions} />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Ứng Dụng Ôn Luyện Trắc Nghiệm Multitopic • Quản lý nhiều chủ đề & Xáo trộn đề</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              Lịch sử ({historyRecords.length})
            </button>
            <span>•</span>
            <button
              onClick={() => setIsBankModalOpen(true)}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              Kho ({questions.length} câu)
            </button>
            <span>•</span>
            <button
              onClick={handleDownloadStandalone}
              className="text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              Tải file HTML đơn lẻ (.html)
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TopicModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        onSaveTopic={handleSaveTopic}
        editingTopic={editingTopic}
      />

      <QuestionBankModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        questions={questions}
        categories={activeTopic ? [activeTopic.title] : ['Chủ đề']}
        onDeleteCustomQuestion={handleDeleteCustomQuestion}
        onResetToDefault={handleResetToDefault}
        onDownloadHtml={handleDownloadStandalone}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddQuestion={handleAddQuestion}
        categories={activeTopic ? [activeTopic.title] : ['Chủ đề']}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        records={historyRecords}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
