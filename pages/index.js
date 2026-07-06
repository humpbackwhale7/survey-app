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
    // 🔥 핵심: question = 1~6 숫자 저장
    const data = Object.entries(answers).map(([qIndex, answer]) => ({
      question: Number(qIndex) + 1,
      answer,
    }));

    const { error } = await supabase
      .from("survey_responses")
      .insert(data);

    if (error) {
      console.error(error);
      alert("저장 실패 😢");
      return;
    }

    alert("제출 완료 🎉");

    // 초기화
    setAnswers({});
  };

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1>설문조사 (대상기간: 2025.1.1~2025.12.31)</h1>

      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <p style={{ fontWeight: "bold" }}>
            {i + 1}. {q}
          </p>

          {options.map((opt) => (
            <label key={opt} style={{ display: "block", marginBottom: 4 }}>
              <input
                type="radio"
                name={`q-${i}`}
                checked={answers[i] === opt}
                onChange={() => handleAnswer(i, opt)}
              />
              {" "}{opt}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={submit}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        제출
      </button>
    </div>
  );
}
