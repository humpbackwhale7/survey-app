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
    const data = Object.entries(answers).map(([qIndex, answer]) => ({
      question: questions[qIndex],
      answer,
    }));

    await supabase.from("survey_responses").insert(data);

    alert("제출 완료 🎉");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>설문조사(대상기간:2025.1.1~2025.12.31)</h1>

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
