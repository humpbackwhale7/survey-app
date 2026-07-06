import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [responses, setResponses] = useState([]);

  const scoreMap = {
    "매우 그렇다": 100,
    "그렇다": 90,
    "보통이다": 80,
    "그렇지 않다": 60,
    "매우 그렇지 않다": 50,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("survey_responses")
      .select("question, answer");

    if (error) {
      console.error(error);
      return;
    }

    setResponses(data || []);
  };

  // -------------------------
  // 응답자 수
  // -------------------------
  const respondentCount =
    responses.length > 0 ? Math.ceil(responses.length / 6) : 0;

  // -------------------------
  // 종합 평균
  // -------------------------
  const totalScore = responses.reduce((sum, r) => {
    return sum + (scoreMap[r.answer] || 0);
  }, 0);

  const avgScore = responses.length
    ? (totalScore / responses.length).toFixed(1)
    : 0;

  // -------------------------
  // 문항별 점수 (🔥 핵심 수정)
  // -------------------------
  const questionAvg = {};

  responses.forEach((r) => {
    const q = Number(r.question);

    // 🚨 핵심 방어코드 (NaN 제거)
    if (!Number.isFinite(q)) return;

    const score = scoreMap[r.answer] || 0;

    if (!questionAvg[q]) {
      questionAvg[q] = { sum: 0, count: 0 };
    }

    questionAvg[q].sum += score;
    questionAvg[q].count += 1;
  });

  // -------------------------
  // 항목별 점수 (0~5 기준)
  // -------------------------
  const category = {
    "메뉴활용의 편리성": { sum: 0, count: 0 }, // 0,1
    "디자인/가독성": { sum: 0, count: 0 },     // 2
    "시스템 효율성": { sum: 0, count: 0 },     // 3
    "오류예방": { sum: 0, count: 0 },          // 4
    "오류해결": { sum: 0, count: 0 },          // 5
  };

  responses.forEach((r) => {
    const q = Number(r.question);

    // 🚨 이것도 필수
    if (!Number.isFinite(q)) return;

    const score = scoreMap[r.answer] || 0;

    if (q === 0 || q === 1) {
      category["메뉴활용의 편리성"].sum += score;
      category["메뉴활용의 편리성"].count += 1;
    } else if (q === 2) {
      category["디자인/가독성"].sum += score;
      category["디자인/가독성"].count += 1;
    } else if (q === 3) {
      category["시스템 효율성"].sum += score;
      category["시스템 효율성"].count += 1;
    } else if (q === 4) {
      category["오류예방"].sum += score;
      category["오류예방"].count += 1;
    } else if (q === 5) {
      category["오류해결"].sum += score;
      category["오류해결"].count += 1;
    }
  });

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1>📊 관리자 페이지</h1>

      <div style={{ marginTop: 30 }}>
        <h2>응답자 수</h2>
        <p style={{ fontSize: 22 }}>{respondentCount}명</p>
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>종합 평균 점수</h2>
        <p style={{ fontSize: 22 }}>{avgScore}점</p>
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>문항별 점수</h2>
        {Object.entries(questionAvg).map(([q, v]) => (
          <p key={q}>
            {Number(q) + 1}번 : {(v.sum / v.count).toFixed(1)}점
          </p>
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>항목별 점수</h2>

        {Object.entries(category).map(([name, v]) => (
          <p key={name}>
            {name} :{" "}
            {v.count > 0 ? (v.sum / v.count).toFixed(1) : 0}점
          </p>
        ))}
      </div>
    </div>
  );
}
