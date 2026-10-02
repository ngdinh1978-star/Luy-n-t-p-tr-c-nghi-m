import { Question, Topic } from '../types';

export function generateStandaloneHtml(questions: Question[], allTopics?: Topic[]): string {
  // If topics are passed and non-empty, serialize them; otherwise empty object {}
  const topicsData: Record<string, { title: string; questions: { question: string; options: string[]; correct: number; explanation: string }[] }> = {};

  if (allTopics && allTopics.length > 0) {
    allTopics.forEach(t => {
      topicsData[t.id] = {
        title: t.title,
        questions: t.questions.map(q => ({
          question: q.question,
          options: q.options,
          correct: q.correct,
          explanation: q.explanation || "Không có giải thích chi tiết."
        }))
      };
    });
  }

  const serializedTopics = JSON.stringify(topicsData, null, 2);

  return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ứng Dụng Trắc Nghiệm Ôn Tập</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Tích hợp Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>

    <style>
      body { font-family: 'Be Vietnam Pro', sans-serif; }
    </style>
</head>
<body class="bg-slate-100 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200">
        <header class="border-b border-slate-100 pb-4 mb-6 text-center">
            <h1 class="text-2xl md:text-3xl font-bold text-slate-800">Ứng Dụng Trắc Nghiệm Ôn Tập</h1>
            <p class="text-sm text-slate-500 mt-1">Tự tạo và quản lý bộ câu hỏi ôn tập cá nhân</p>
            
            <!-- Thống kê lượt làm từ Firebase -->
            <div class="mt-3 flex flex-wrap items-center justify-center gap-2">
                <div class="inline-flex items-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 border border-slate-200">
                    <span>🌐 Tổng lượt làm:</span>
                    <span id="total-attempts-count" class="font-bold text-indigo-600">0</span>
                </div>

                <div class="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full text-xs font-medium text-emerald-700">
                    <span>📱 Từ điện thoại:</span>
                    <span id="mobile-attempts-count" class="font-bold text-emerald-600">0</span>
                </div>
            </div>

            <!-- QUẢN LÝ CHỦ ĐỀ -->
            <div class="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2 w-full sm:w-auto">
                        <label for="topic-select" class="text-xs font-bold text-slate-700 whitespace-nowrap">📌 Chủ đề:</label>
                        <select id="topic-select" onchange="changeTopic(this.value)" class="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold w-full sm:w-auto cursor-pointer outline-none disabled:bg-slate-100 disabled:text-slate-400">
                            <!-- Danh sách chủ đề sẽ tự động load vào đây -->
                        </select>
                    </div>

                    <div class="flex items-center gap-1.5 w-full sm:w-auto justify-end flex-wrap">
                        <button onclick="openAddTopicModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 cursor-pointer shadow-xs">
                            ➕ Thêm mới
                        </button>
                        <button id="edit-btn" onclick="openEditTopicModal()" class="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 cursor-pointer shadow-xs">
                            ✏️ Sửa
                        </button>
                        <button id="delete-btn" onclick="deleteCurrentTopic()" class="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 cursor-pointer">
                            🗑️ Xóa
                        </button>
                    </div>
                </div>
            </div>
            
            <p id="quiz-source-tag" class="text-xs text-indigo-600 font-medium mt-2">Chưa có chủ đề nào...</p>
        </header>

        <!-- Trạng thái chưa có chủ đề -->
        <div id="empty-state" class="hidden text-center py-12">
            <div class="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                📝
            </div>
            <h3 class="text-lg font-bold text-slate-800 mb-1">Chưa có chủ đề nào!</h3>
            <p class="text-sm text-slate-500 mb-5">Hãy tạo chủ đề đầu tiên bằng cách dán danh sách câu hỏi của bạn.</p>
            <button onclick="openAddTopicModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2.5 rounded-xl font-semibold transition cursor-pointer shadow-xs">
                ➕ Thêm chủ đề mới ngay
            </button>
        </div>

        <!-- Quiz Screen -->
        <div id="quiz-screen">
            <div class="flex justify-between items-center mb-4">
                <span id="question-count" class="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Câu 1/5</span>
                <span id="score-display" class="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Điểm: 0</span>
            </div>

            <div id="question-text" class="text-lg md:text-xl font-medium text-slate-800 mb-6 leading-relaxed"></div>

            <div id="options-container" class="space-y-3 mb-6"></div>

            <!-- Explanation Box -->
            <div id="explanation-box" class="hidden p-4 rounded-xl bg-blue-50 border border-blue-200 text-slate-700 text-sm mb-6 shadow-sm">
                <p class="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                    <span>💡</span> Giải thích chi tiết:
                </p>
                <p id="explanation-text" class="leading-relaxed"></p>
            </div>

            <button id="next-btn" onclick="nextQuestion()" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition duration-200 hidden cursor-pointer">
                Câu tiếp theo &rarr;
            </button>
        </div>

        <!-- Result Screen -->
        <div id="result-screen" class="hidden py-2">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span class="text-3xl">🏆</span>
                </div>
                <h2 class="text-2xl font-bold text-slate-800">Hoàn Thành Bài Tập!</h2>
                <p class="text-slate-600 text-sm mt-1">Kết quả lượt làm hiện tại của bạn:</p>
                
                <div class="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl max-w-xs mx-auto mt-3">
                    <p id="final-score" class="text-3xl font-extrabold text-indigo-600">0/5</p>
                    <p id="final-percentage" class="text-xs font-semibold text-indigo-500 mt-1">(0% chính xác)</p>
                </div>
            </div>

            <!-- Lịch sử làm bài -->
            <div class="border-t border-slate-100 pt-4 mb-6 text-left">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-bold text-slate-700 text-sm flex items-center gap-1">
                        📜 Lịch sử cá nhân (chủ đề này)
                    </h3>
                    <button onclick="clearHistory()" class="text-xs text-rose-500 hover:underline cursor-pointer">Xóa lịch sử</button>
                </div>
                
                <div id="history-list" class="space-y-2 max-h-48 overflow-y-auto pr-1 text-sm"></div>
            </div>

            <button onclick="restartQuiz()" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition duration-200 cursor-pointer">
                Làm lại bài tập (Xáo trộn mới)
            </button>
        </div>
    </div>

    <!-- MODAL THÊM / SỬA CHỦ ĐỀ -->
    <div id="topic-modal" class="fixed inset-0 bg-black/50 backdrop-blur-xs hidden flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <h3 id="modal-title" class="text-lg font-bold text-slate-800 mb-1">➕ Thêm Chủ Đề Mới</h3>
            <p class="text-xs text-slate-500 mb-4">Dán danh sách câu hỏi theo định dạng đơn giản bên dưới.</p>
            
            <input type="hidden" id="edit-topic-key" value="">

            <div class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Tên chủ đề:</label>
                    <input type="text" id="topic-title-input" placeholder="VD: Tiếng Anh Bài 1, Lịch Sử 12..." class="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>

                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="block text-xs font-semibold text-slate-700">Nội dung câu hỏi:</label>
                        <button id="sample-btn" onclick="insertSampleText()" class="text-[11px] text-indigo-600 hover:underline cursor-pointer font-semibold">Dán mẫu ví dụ</button>
                    </div>
                    <textarea id="topic-text-input" rows="11" placeholder="1. Chiến thắng Điện Biên Phủ diễn ra năm nào?&#10;A. 1945&#10;B. 1954&#10;C. 1968&#10;D. 1975&#10;Đáp án: B&#10;Giải thích: Ngày 7/5/1954." class="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"></textarea>
                </div>
            </div>

            <div class="mt-6 flex justify-end gap-2">
                <button onclick="closeTopicModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer">Hủy</button>
                <button onclick="saveTopic()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs">Lưu chủ đề</button>
            </div>
        </div>
    </div>

    <script>
        // -----------------------------------------------------------------
        // 1. CẤU HÌNH FIREBASE DATABASE
        // -----------------------------------------------------------------
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
            databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_PROJECT_ID.appspot.com",
            messagingSenderId: "1234567890",
            appId: "YOUR_APP_ID"
        };

        function isMobileDevice() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }

        let db = null;
        try {
            if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
                firebase.initializeApp(firebaseConfig);
                db = firebase.database();
                
                db.ref('global_attempts').on('value', (snapshot) => {
                    document.getElementById('total-attempts-count').innerText = snapshot.val() || 0;
                });

                db.ref('mobile_attempts').on('value', (snapshot) => {
                    document.getElementById('mobile-attempts-count').innerText = snapshot.val() || 0;
                });
            } else {
                initLocalCounters();
            }
        } catch (e) {
            initLocalCounters();
        }

        function initLocalCounters() {
            let total = parseInt(localStorage.getItem('fallback_total_count') || '0');
            let mobile = parseInt(localStorage.getItem('fallback_mobile_count') || '0');
            if (total === 0) {
                total = 32;
                mobile = 21;
                localStorage.setItem('fallback_total_count', total);
                localStorage.setItem('fallback_mobile_count', mobile);
            }
            document.getElementById('total-attempts-count').innerText = total;
            document.getElementById('mobile-attempts-count').innerText = mobile;
        }

        function incrementGlobalAttempts() {
            if (db) {
                db.ref('global_attempts').transaction((count) => (count || 0) + 1);
                if (isMobileDevice()) {
                    db.ref('mobile_attempts').transaction((count) => (count || 0) + 1);
                }
            } else {
                let total = parseInt(localStorage.getItem('fallback_total_count') || '0') + 1;
                localStorage.setItem('fallback_total_count', total);
                document.getElementById('total-attempts-count').innerText = total;

                if (isMobileDevice()) {
                    let mobile = parseInt(localStorage.getItem('fallback_mobile_count') || '0') + 1;
                    localStorage.setItem('fallback_mobile_count', mobile);
                    document.getElementById('mobile-attempts-count').innerText = mobile;
                }
            }
        }

        // -----------------------------------------------------------------
        // 2. PARSER
        // -----------------------------------------------------------------
        function parseTextToQuestions(text) {
            const blocks = text.split(/\\n\\s*\\n/);
            const questions = [];

            blocks.forEach(block => {
                const lines = block.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
                if (lines.length < 3) return;

                let questionText = "";
                let options = [];
                let correctIndex = -1;
                let explanation = "";

                lines.forEach(line => {
                    if (/^(đáp án|dap an|correct|ans|đáp án đúng):/i.test(line)) {
                        const val = line.split(':')[1].trim().toUpperCase();
                        if (val === 'A') correctIndex = 0;
                        else if (val === 'B') correctIndex = 1;
                        else if (val === 'C') correctIndex = 2;
                        else if (val === 'D') correctIndex = 3;
                        else if (!isNaN(val)) correctIndex = parseInt(val) - 1;
                    } 
                    else if (/^(giải thích|giai thich|explanation):/i.test(line)) {
                        explanation = line.replace(/^(giải thích|giai thich|explanation):/i, '').trim();
                    }
                    else if (/^[A-D1-4][\\.\\)\\:-]/i.test(line) || line.startsWith('-')) {
                        const optText = line.replace(/^[A-D1-4][\\.\\)\\:-]\\s*/i, '').replace(/^-/,'').trim();
                        options.push(optText);
                    }
                    else {
                        const cleanQ = line.replace(/^\\d+[\\.\\)\\:-]\\s*/, '').trim();
                        if (!questionText) {
                            questionText = cleanQ;
                        } else {
                            questionText += " " + cleanQ;
                        }
                    }
                });

                if (questionText && options.length >= 2) {
                    questions.push({
                        question: questionText,
                        options: options,
                        correct: correctIndex >= 0 ? correctIndex : 0,
                        explanation: explanation || "Không có giải thích chi tiết."
                    });
                }
            });

            return questions;
        }

        function convertQuestionsToText(questions) {
            const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
            return questions.map((q, index) => {
                let str = (index + 1) + ". " + q.question + "\\n";
                q.options.forEach((opt, idx) => {
                    str += (labels[idx] || (idx + 1)) + ". " + opt + "\\n";
                });
                const correctLabel = labels[q.correct] || (q.correct + 1);
                str += "Đáp án: " + correctLabel + "\\n";
                if (q.explanation) {
                    str += "Giải thích: " + q.explanation + "\\n";
                }
                return str;
            }).join('\\n');
        }

        // -----------------------------------------------------------------
        // 3. QUẢN LÝ CHỦ ĐỀ & TRẠNG THÁI (KHÔNG CHỨA CHỦ ĐỀ MẶC ĐỊNH)
        // -----------------------------------------------------------------
        let topics = {};
        let currentTopicKey = "";
        let activeQuizData = [];
        let currentQuestion = 0;
        let score = 0;
        let selectedOption = null;

        function initTopics() {
            const savedTopics = localStorage.getItem('quiz_app_topics');
            if (savedTopics) {
                try {
                    topics = JSON.parse(savedTopics);
                } catch(e) {
                    topics = {};
                }
            } else {
                topics = ${serializedTopics};
            }
            
            const keys = Object.keys(topics);
            if (keys.length > 0) {
                currentTopicKey = keys[0];
                renderTopicSelect();
                loadTopicData();
                restartQuiz();
            } else {
                showEmptyState();
            }
        }

        function saveTopicsToStorage() {
            localStorage.setItem('quiz_app_topics', JSON.stringify(topics));
        }

        function showEmptyState() {
            document.getElementById('quiz-screen').classList.add('hidden');
            document.getElementById('result-screen').classList.add('hidden');
            document.getElementById('empty-state').classList.remove('hidden');
            
            document.getElementById('topic-select').innerHTML = '<option value="">-- Trống --</option>';
            document.getElementById('topic-select').disabled = true;
            document.getElementById('edit-btn').classList.add('hidden');
            document.getElementById('delete-btn').classList.add('hidden');
            document.getElementById('quiz-source-tag').innerText = "Chưa có chủ đề nào";
        }

        function renderTopicSelect() {
            const selectEl = document.getElementById('topic-select');
            const keys = Object.keys(topics);

            if (keys.length === 0) {
                showEmptyState();
                return;
            }

            selectEl.disabled = false;
            document.getElementById('edit-btn').classList.remove('hidden');
            document.getElementById('delete-btn').classList.remove('hidden');

            selectEl.innerHTML = keys.map(key => \`
                <option value="\${key}" \${key === currentTopicKey ? 'selected' : ''}>
                    \${topics[key].title} (\${topics[key].questions.length} câu)
                </option>
            \`).join('');
        }

        function changeTopic(newKey) {
            if (!newKey) return;
            currentTopicKey = newKey;
            loadTopicData();
            restartQuiz();
        }

        function loadTopicData() {
            const topic = topics[currentTopicKey];
            if (!topic) {
                showEmptyState();
                return;
            }
            document.getElementById('quiz-source-tag').innerText = "Chủ đề: " + topic.title + " (" + topic.questions.length + " câu hỏi)";
        }

        // MODAL
        function openAddTopicModal() {
            document.getElementById('modal-title').innerText = '➕ Thêm Chủ Đề Mới';
            document.getElementById('edit-topic-key').value = '';
            document.getElementById('topic-title-input').value = '';
            document.getElementById('topic-text-input').value = '';
            document.getElementById('sample-btn').classList.remove('hidden');
            document.getElementById('topic-modal').classList.remove('hidden');
        }

        function openEditTopicModal() {
            const topic = topics[currentTopicKey];
            if (!topic) return;

            document.getElementById('modal-title').innerText = '✏️ Chỉnh Sửa Chủ Đề';
            document.getElementById('edit-topic-key').value = currentTopicKey;
            document.getElementById('topic-title-input').value = topic.title;
            document.getElementById('topic-text-input').value = convertQuestionsToText(topic.questions);
            document.getElementById('sample-btn').classList.add('hidden');
            document.getElementById('topic-modal').classList.remove('hidden');
        }

        function closeTopicModal() {
            document.getElementById('topic-modal').classList.add('hidden');
        }

        function insertSampleText() {
            document.getElementById('topic-title-input').value = "Ví Dụ Mẫu";
            document.getElementById('topic-text-input').value = 
\`1. Thủ đô của Việt Nam là gì?
A. TP. Hồ Chí Minh
B. Đà Nẵng
C. Hà Nội
D. Cần Thơ
Đáp án: C
Giải thích: Hà Nội là thủ đô chính thức của Việt Nam.

2. Kim loại nào dẫn điện tốt nhất?
A. Vàng
B. Bạc
C. Đồng
D. Nhôm
Đáp án: B
Giải thích: Bạc dẫn điện tốt nhất trong số các kim loại.\`;
        }

        function saveTopic() {
            const editKey = document.getElementById('edit-topic-key').value;
            const title = document.getElementById('topic-title-input').value.trim();
            const textContent = document.getElementById('topic-text-input').value.trim();

            if (!title) {
                alert("Vui lòng nhập tên chủ đề!");
                return;
            }

            if (!textContent) {
                alert("Vui lòng nhập nội dung câu hỏi!");
                return;
            }

            const parsedQuestions = parseTextToQuestions(textContent);

            if (parsedQuestions.length === 0) {
                alert("Không nhận diện được câu hỏi nào! Hãy kiểm tra lại định dạng.");
                return;
            }

            let targetKey = editKey || ('custom_' + Date.now());

            topics[targetKey] = {
                title: title,
                questions: parsedQuestions
            };

            saveTopicsToStorage();
            currentTopicKey = targetKey;
            
            document.getElementById('empty-state').classList.add('hidden');
            renderTopicSelect();
            loadTopicData();
            closeTopicModal();
            restartQuiz();
        }

        function deleteCurrentTopic() {
            const current = topics[currentTopicKey];
            if (!current) return;

            if (confirm("Xóa hẳn chủ đề \\"" + current.title + "\\"?")) {
                delete topics[currentTopicKey];
                saveTopicsToStorage();
                
                const remainingKeys = Object.keys(topics);
                if (remainingKeys.length > 0) {
                    currentTopicKey = remainingKeys[0];
                    renderTopicSelect();
                    loadTopicData();
                    restartQuiz();
                } else {
                    currentTopicKey = "";
                    showEmptyState();
                }
            }
        }

        // -----------------------------------------------------------------
        // 4. LOGIC LÀM BÀI
        // -----------------------------------------------------------------
        function shuffleArray(array) {
            let shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        function prepareQuizData() {
            if (!topics[currentTopicKey]) return;
            const rawQuestions = topics[currentTopicKey].questions;
            let shuffledQuestions = shuffleArray(rawQuestions);
            activeQuizData = shuffledQuestions.map(q => {
                const correctAnswerText = q.options[q.correct];
                const shuffledOptions = shuffleArray(q.options);
                const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);

                return {
                    ...q,
                    options: shuffledOptions,
                    correct: newCorrectIndex,
                    explanation: q.explanation || "Không có giải thích chi tiết."
                };
            });
        }

        function loadQuestion() {
            if (!activeQuizData || activeQuizData.length === 0) return;

            selectedOption = null;
            document.getElementById('explanation-box').classList.add('hidden');
            document.getElementById('next-btn').classList.add('hidden');
            
            const current = activeQuizData[currentQuestion];
            document.getElementById('question-count').innerText = "Câu " + (currentQuestion + 1) + "/" + activeQuizData.length;
            document.getElementById('question-text').innerText = current.question;

            const optionsContainer = document.getElementById('options-container');
            optionsContainer.innerHTML = '';

            const prefixes = ['A', 'B', 'C', 'D'];
            current.options.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.className = 'w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition duration-150 flex items-center gap-3 text-slate-700 font-medium cursor-pointer';
                btn.innerHTML = '<span class="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">' + (prefixes[index] || (index + 1)) + '</span><span class="flex-1">' + option + '</span>';
                btn.onclick = () => selectOption(index);
                optionsContainer.appendChild(btn);
            });
        }

        function selectOption(index) {
            if (selectedOption !== null) return;

            selectedOption = index;
            const current = activeQuizData[currentQuestion];
            const options = document.getElementById('options-container').children;

            if (index === current.correct) {
                score++;
                options[index].classList.remove('border-slate-200');
                options[index].classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-900', 'ring-2', 'ring-emerald-500/20');
                options[index].querySelector('span').classList.add('bg-emerald-600', 'text-white');
                document.getElementById('score-display').innerText = 'Điểm: ' + score;
            } else {
                options[index].classList.remove('border-slate-200');
                options[index].classList.add('bg-rose-50', 'border-rose-500', 'text-rose-900', 'ring-2', 'ring-rose-500/20');
                options[index].querySelector('span').classList.add('bg-rose-600', 'text-white');

                options[current.correct].classList.remove('border-slate-200');
                options[current.correct].classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-900', 'ring-2', 'ring-emerald-500/20');
                options[current.correct].querySelector('span').classList.add('bg-emerald-600', 'text-white');
            }

            for (let btn of options) {
                btn.classList.remove('hover:border-indigo-400', 'hover:bg-indigo-50/40', 'cursor-pointer');
                btn.disabled = true;
            }

            document.getElementById('explanation-text').innerText = current.explanation;
            document.getElementById('explanation-box').classList.remove('hidden');

            const nextBtn = document.getElementById('next-btn');
            if (currentQuestion < activeQuizData.length - 1) {
                nextBtn.innerText = 'Câu tiếp theo →';
            } else {
                nextBtn.innerText = 'Xem kết quả tổng kết 🏆';
            }
            nextBtn.classList.remove('hidden');
        }

        function nextQuestion() {
            currentQuestion++;
            if (currentQuestion < activeQuizData.length) {
                loadQuestion();
            } else {
                showResult();
            }
        }

        function showResult() {
            incrementGlobalAttempts();
            saveScoreRecord(score, activeQuizData.length);
            
            document.getElementById('quiz-screen').classList.add('hidden');
            document.getElementById('result-screen').classList.remove('hidden');
            
            document.getElementById('final-score').innerText = score + '/' + activeQuizData.length;
            const pct = Math.round((score / activeQuizData.length) * 100);
            document.getElementById('final-percentage').innerText = '(' + pct + '% chính xác)';
            
            renderHistoryList();
        }

        function restartQuiz() {
            if (!topics[currentTopicKey]) return;

            currentQuestion = 0;
            score = 0;
            document.getElementById('score-display').innerText = 'Điểm: 0';
            document.getElementById('result-screen').classList.add('hidden');
            document.getElementById('empty-state').classList.add('hidden');
            document.getElementById('quiz-screen').classList.remove('hidden');
            
            prepareQuizData();
            loadQuestion();
        }

        function saveScoreRecord(currentScore, totalQuestions) {
            let history = JSON.parse(localStorage.getItem('history_' + currentTopicKey) || '[]');
            const now = new Date();
            const timeString = now.getHours().toString().padStart(2, '0') + ':' +
                               now.getMinutes().toString().padStart(2, '0') + ' - ' +
                               now.getDate().toString().padStart(2, '0') + '/' +
                               (now.getMonth() + 1).toString().padStart(2, '0') + '/' +
                               now.getFullYear();
            
            history.unshift({
                date: timeString,
                score: currentScore,
                total: totalQuestions,
                percentage: Math.round((currentScore / totalQuestions) * 100)
            });
            localStorage.setItem('history_' + currentTopicKey, JSON.stringify(history));
        }

        function renderHistoryList() {
            let history = JSON.parse(localStorage.getItem('history_' + currentTopicKey) || '[]');
            const historyListEl = document.getElementById('history-list');

            if (!historyListEl) return;

            if (history.length === 0) {
                historyListEl.innerHTML = '<p class="text-center text-slate-400 py-3 italic">Chưa có lịch sử làm bài cho chủ đề này.</p>';
                return;
            }

            historyListEl.innerHTML = history.map((record, index) => \`
                <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                    <div>
                        <span class="font-semibold text-slate-700">Lần \${history.length - index}</span>
                        <span class="text-xs text-slate-400 ml-2">(\${record.date})</span>
                    </div>
                    <div class="text-right">
                        <span class="font-bold text-indigo-600">\${record.score}/\${record.total}</span>
                        <span class="text-xs text-slate-500 ml-1">(\${record.percentage}%)</span>
                    </div>
                </div>
            \`).join('');
        }

        function clearHistory() {
            if (confirm("Xóa lịch sử làm bài của chủ đề này?")) {
                localStorage.removeItem('history_' + currentTopicKey);
                renderHistoryList();
            }
        }

        initTopics();
    </script>
</body>
</html>`;
}

export function downloadStandaloneHtmlFile(questions: Question[], allTopics?: Topic[]) {
  const content = generateStandaloneHtml(questions, allTopics);
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quiz_app_multi_topics.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSampleJsonTemplate() {
  const sample = [
    {
      question: "Câu hỏi mẫu 1: Thủ đô của Việt Nam là gì?",
      options: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Huế"],
      correct: 0,
      explanation: "Hà Nội là thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam."
    },
    {
      question: "Câu hỏi mẫu 2: Ngọn núi cao nhất thế giới là gì?",
      options: ["Everest", "K2", "Kangchenjunga", "Lhotse"],
      correct: 0,
      explanation: "Đỉnh Everest (Chomolungma) cao 8.848m là đỉnh núi cao nhất trên Trái Đất."
    }
  ];

  const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mau_cau_hoi_trac_nghiem.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
