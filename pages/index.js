import { useState } from "react";
import { supabase } from "../lib/supabase";

const questions = [
  "정보시스템의 메뉴는 이해하기 쉬운가?",
  "화면 구성은 직관적인가?",
  "용어는 명확한가?",
  "응답 속도는 적절한가?",
  "오류 메시지는 이해하기 쉬운가?",
  "전체 만족도는 어떠한가?"
];

const options = [
  "매우 그렇다",
  "그렇다",
  "보통이다",
  "그렇지 않다",
  "매우 그렇지 않다"
];

export default function Home() {
  const [answers, setAnswers] = useState({});

  const handleAnswer = (qIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: value,
    }));
  };

const submit = async () => {
  const data = questions.map((_, qIndex) => ({
    question: qIndex,
    answer: answers[qIndex] || null,
  }));

  // ❗ 빈 답 제거 (핵심)
  const filtered = data.filter(d => d.answer !== null);

  const { error } = await supabase
    .from("survey_responses")
    .insert(filtered);

  if (error) {
    console.error(error);
    alert("저장 실패 😢");
  } else {
    alert("제출 완료 🎉");
    setAnswers({});
  }
};

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1>설문조사 (대상기간: 2025.1.1~2025.12.31)</h1>

      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <p>{i + 1}. {q}</p>

          {options.map((opt) => (
            <label key={opt} style={{ display: "block" }}>
              <input
                type="radio"
                name={`q-${i}`}
                onChange={() => handleAnswer(i, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button onClick={submit}>
        제출
      </button>
    </div>
  );
}
