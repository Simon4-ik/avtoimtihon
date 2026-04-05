"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchRandomQuestions, startExam, submitExam } from '@/utils/api';

export default function ExamPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock user for MVP
  const dummyUserId = "00000000-0000-0000-0000-000000000000";

  useEffect(() => {
    async function initExam() {
      try {
        const qList = await fetchRandomQuestions(20);
        setQuestions(qList);
        
        // Use a dummy user or logic if backend auth isn't seeded yet. 
        // We will catch the error just in case and still let them click through the mockup.
        try {
            const sess = await startExam(dummyUserId);
            setSession(sess);
        } catch (e) {
            console.warn("Backend user not found, mocking session.", e);
        }

        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
    initExam();
  }, []);

  // Timer logic
  useEffect(() => {
    if (loading || timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [loading, timeLeft]);

  const handleSelect = (ansId) => {
    setAnswers({ ...answers, [questions[currentIdx].id]: ansId });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (session) {
      const payload = Object.keys(answers).map(qId => ({
        question_id: parseInt(qId),
        selected_answer_id: answers[qId]
      }));
      try {
        await submitExam(session.id, payload);
        router.push('/results');
      } catch (e) {
        console.error(e);
        alert("Failed to submit exam");
      }
    } else {
        router.push('/results'); // bypass for MVP preview
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>Loading Exam...</div>;
  if (!questions.length) return <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>No questions available from backend yet. (Please seed database)</div>;

  const q = questions[currentIdx];
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold" }}>
        <span>Question {currentIdx + 1}/{questions.length}</span>
        <span style={{ color: timeLeft < 60 ? "red" : "inherit" }}>⏱ {mins}:{secs}</span>
      </div>
      
      <div style={{ marginTop: "40px" }}>
        <h2>{q.question_text || "Untitled Question"}</h2>
        
        {q.image_url ? (
          <img src={q.image_url} alt="Question" style={{ width: "100%", maxHeight: "250px", objectFit: "contain", margin: "20px 0" }} />
        ) : (
          <div style={{ width: "100%", height: "150px", backgroundColor: "#eee", margin: "20px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            [ No Image Displayed ]
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {q.answers && q.answers.map((ans) => (
            <label 
              key={ans.id} 
              style={{ 
                padding: "15px", 
                border: answers[q.id] === ans.id ? "2px solid #0070f3" : "1px solid #ccc", 
                backgroundColor: answers[q.id] === ans.id ? "#f0f7ff" : "white",
                borderRadius: "8px", 
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <input 
                type="radio" 
                name={`question_${q.id}`} 
                checked={answers[q.id] === ans.id}
                onChange={() => handleSelect(ans.id)}
                style={{ marginRight: "10px" }}
              />
              {ans.answer_text}
            </label>
          ))}
        </div>
        
        <button 
          onClick={handleNext}
          disabled={!answers[q.id]}
          style={{ 
            marginTop: "30px", 
            width: "100%", 
            padding: "15px", 
            fontSize: "16px", 
            backgroundColor: answers[q.id] ? "#0070f3" : "#ccc", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            cursor: answers[q.id] ? "pointer" : "not-allowed",
            transition: "background-color 0.2s"
          }}>
          {currentIdx === questions.length - 1 ? 'Submit Exam' : 'Next'}
        </button>
      </div>
    </div>
  );
}
