import { Question } from '../types';

/**
 * Parses plain text formatted quiz questions into Question objects.
 * Format supported:
 *
 * 1. Câu hỏi ở đây?
 * A. Đáp án 1
 * B. Đáp án 2
 * C. Đáp án 3
 * D. Đáp án 4
 * Đáp án: B (hoặc Đáp án: 2, Correct: A,...)
 * Giải thích: Nội dung giải thích chi tiết.
 *
 * (Các câu cách nhau bằng một hoặc nhiều dòng trống)
 */
export function parseTextToQuestions(text: string, topicCategory: string = 'Tổng hợp'): Question[] {
  const blocks = text.split(/\n\s*\n/);
  const questions: Question[] = [];

  blocks.forEach((block, blockIndex) => {
    const lines = block
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length < 3) return;

    let questionText = '';
    const options: string[] = [];
    let correctIndex = -1;
    let explanation = '';

    lines.forEach(line => {
      // Dòng đáp án đúng (VD: Đáp án: A hoặc Đáp án: 1 hoặc Correct: B)
      if (/^(đáp án|dap an|correct|ans|đáp án đúng):/i.test(line)) {
        const val = line.split(':')[1].trim().toUpperCase();
        if (val === 'A') correctIndex = 0;
        else if (val === 'B') correctIndex = 1;
        else if (val === 'C') correctIndex = 2;
        else if (val === 'D') correctIndex = 3;
        else if (!isNaN(parseInt(val, 10))) {
          correctIndex = parseInt(val, 10) - 1;
        }
      }
      // Dòng giải thích (VD: Giải thích: ...)
      else if (/^(giải thích|giai thich|explanation):/i.test(line)) {
        explanation = line.replace(/^(giải thích|giai thich|explanation):/i, '').trim();
      }
      // Dòng lựa chọn (VD: A. ..., B. ..., 1. ..., - ...)
      else if (/^[A-D1-4][\.\)\:-]/i.test(line) || line.startsWith('-')) {
        const optText = line
          .replace(/^[A-D1-4][\.\)\:-]\s*/i, '')
          .replace(/^-+\s*/, '')
          .trim();
        if (optText) {
          options.push(optText);
        }
      }
      // Dòng nội dung câu hỏi
      else {
        // Loại bỏ số thứ tự câu hỏi ở đầu nếu có (VD: 1. Câu hỏi? -> Câu hỏi?)
        const cleanQ = line.replace(/^\d+[\.\)\:-]\s*/, '').trim();
        if (!questionText) {
          questionText = cleanQ;
        } else {
          questionText += ' ' + cleanQ;
        }
      }
    });

    if (questionText && options.length >= 2) {
      questions.push({
        id: `parsed-q-${Date.now()}-${blockIndex}`,
        question: questionText,
        options,
        correct: correctIndex >= 0 && correctIndex < options.length ? correctIndex : 0,
        explanation: explanation || 'Không có giải thích chi tiết.',
        category: topicCategory,
        difficulty: 'Trung bình',
        isCustom: true
      });
    }
  });

  return questions;
}

/**
 * Converts Question[] objects back into clean, editable plain text.
 */
export function convertQuestionsToText(questions: Question[]): string {
  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
  return questions.map((q, index) => {
    let str = `${index + 1}. ${q.question}\n`;
    q.options.forEach((opt, idx) => {
      str += `${labels[idx] || (idx + 1)}. ${opt}\n`;
    });
    const correctLabel = labels[q.correct] || (q.correct + 1);
    str += `Đáp án: ${correctLabel}\n`;
    if (q.explanation) {
      str += `Giải thích: ${q.explanation}\n`;
    }
    return str;
  }).join('\n');
}

export const SAMPLE_PLAIN_TEXT_QUIZ = `1. Thủ đô của Việt Nam là gì?
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
Giải thích: Bạc dẫn điện tốt nhất trong số các kim loại.`;
