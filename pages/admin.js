import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [responses, setResponses] = useState([]);

  const scoreMap = {
    "매우 그렇다": 5,
    "그렇다": 4,
    "보통이다": 3,
    "그렇지 않다": 2,
    "매우 그렇지 않다": 1,
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
  // 1️⃣ 응답자 수
  // -------------------------
  const respondentCount = responses.length;

  // -------------------------
  // 2️⃣ 종합 평균
  // -------------------------
  const totalScore =
    responses.reduce((sum, r) => {
      return sum + (scoreMap[r.answer] || 0);
    }, 0);

  const avgScore = responses.length
    ? ((totalScore / responses.length) / 5 * 100).toFixed(1)
    : 0;

  // -------------------------
  // 3️⃣ 문항별 평균
  // -------------------------
  const questionAvg = {};

  responses.forEach((r) => {
    const q = r.question;
    const score = scoreMap[r.answer] || 0;

    if (!questionAvg[q]) {
      questionAvg[q] = { sum: 0, count: 0 };
    }

    questionAvg[q].sum += score;
    questionAvg[q].count += 1;
  });

  // -------------------------
  // 4️⃣ 항목별 매핑
  // -------------------------
  const category = {
    "메뉴활용의 편리성": { sum: 0, count: 0 }, // 1,2
    "디자인/가독성": { sum: 0, count: 0 }, // 3
    "시스템 효율성": { sum: 0, count: 0 }, // 4
    "오류예방": { sum: 0, count: 0 }, // 5
    "오류해결": { sum: 0, count: 0 }, // 6
  };

  responses.forEach((r) => {
    const score = scoreMap[r.answer] || 0;
    const q = r.question;

    if (q.includes("1") || q.includes("2")) {
      category["메뉴활용의 편리성"].sum += score;
      category["메뉴활용의 편리성"].count += 1;
    } else if (q.includes("3")) {
      category["디자인/가독성"].sum += score;
      category["디자인/가독성"].count += 1;
    } else if (q.includes("4")) {
      category["시스템 효율성"].sum += score;
      category["시스템 효율성"].count += 1;
    } else if (q.includes("5")) {
      category["오류예방"].sum += score;
      category["오류예방"].count += 1;
    } else if (q.includes("6")) {
      category["오류해결"].sum += score;
      category["오류해결"].count += 1;
    }
  });

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1>📊 관리자 페이지</h1>

      {/* 응답자 수 */}
      <div style={{ marginTop: 30 }}>
        <h2>응답자 수</h2>
        <p style={{ fontSize: 22 }}>{respondentCount}명</p>
      </div>

      {/* 종합 점수 */}
      <div style={{ marginTop: 30 }}>
        <h2>종합 평균 점수</h2>
        <p style={{ fontSize: 22 }}>{avgScore}점</p>
      </div>

      {/* 문항별 */}
      <div style={{ marginTop: 30 }}>
        <h2>문항별 점수</h2>
        {Object.entries(questionAvg).map(([q, v], i) => (
          <p key={i}>
            {q} : {(v.sum / v.count).toFixed(1)}점
          </p>
        ))}
      </div>

      {/* 항목별 */}
      <div style={{ marginTop: 30 }}>
        <h2>항목별 점수</h2>

        <p>
          메뉴활용의 편리성 :{" "}
          {(category["메뉴활용의 편리성"].sum /
            category["메뉴활용의 편리성"].count || 0).toFixed(1)}점
        </p>

        <p>
          디자인/가독성 :{" "}
          {(category["디자인/가독성"].sum /
            category["디자인/가독성"].count || 0).toFixed(1)}점
        </p>

        <p>
          시스템 효율성 :{" "}
          {(category["시스템 효율성"].sum /
            category["시스템 효율성"].count || 0).toFixed(1)}점
        </p>

        <p>
          오류예방 :{" "}
          {(category["오류예방"].sum /
            category["오류예방"].count || 0).toFixed(1)}점
        </p>

        <p>
          오류해결 :{" "}
          {(category["오류해결"].sum /
            category["오류해결"].count || 0).toFixed(1)}점
        </p>
      </div>
    </div>
  );
}
