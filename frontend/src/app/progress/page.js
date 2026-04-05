"use client";

import { useState, useEffect } from 'react';
import { fetchProgress, fetchTopicProgress } from '@/utils/api';

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [topics, setTopics] = useState([]);

  // Mock user for MVP
  const dummyUserId = "00000000-0000-0000-0000-000000000000";

  useEffect(() => {
    async function loadStats() {
      try {
        const progData = await fetchProgress(dummyUserId);
        const topsData = await fetchTopicProgress(dummyUserId);
        setProgress(progData);
        setTopics(topsData);
        setLoading(false);
      } catch (err) {
        console.warn("Failed to load progress tracking.", err);
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>Loading Analytics...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Your Progress</h1>
      {progress ? (
         <>
          <p style={{ fontSize: "24px" }}>Accuracy: <strong>{progress.overall_accuracy_percent}%</strong></p>
          <p style={{ color: "#666" }}>Total Questions Evaluated: {progress.total_questions_answered}</p>

          <div style={{ marginTop: "40px" }}>
            <h3>Topics Breakdown</h3>
            {topics.length === 0 ? <p>No topic data tracked yet.</p> : null}
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {topics.map(t => (
                <li key={t.topic_id} style={{ padding: "10px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
                  <span>{t.topic_name}</span>
                  <span style={{ color: t.accuracy_percent < 60 ? "red" : (t.accuracy_percent > 85 ? "green" : "inherit") }}>
                    {t.accuracy_percent}%
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: "40px" }}>
            <h3>Recent Exams</h3>
            {progress.recent_exams.length === 0 ? <p>No exams taken.</p> : null}
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {progress.recent_exams.map(exam => (
                <li key={exam.id} style={{ padding: "10px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
                  <span>{new Date(exam.date).toLocaleString()}</span>
                  <span style={{ color: exam.passed ? "green" : "red", fontWeight: "bold" }}>
                    {exam.score}/20
                  </span>
                </li>
              ))}
            </ul>
          </div>
         </>
      ) : (
         <div style={{ padding: "20px", background: "#fee", borderRadius: "8px", color: "red" }}>
           Database unlinked or unseeded. Can't show progress data.
         </div>
      )}
    </div>
  );
}
