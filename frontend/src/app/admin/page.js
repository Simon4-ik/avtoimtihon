"use client";

import { useState } from 'react';

// Basic MVP Admin UI
export default function AdminPage() {
  const [topicName, setTopicName] = useState("");
  const [topicDesc, setTopicDesc] = useState("");

  const [questionText, setQuestionText] = useState("");
  const [topicId, setTopicId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [answers, setAnswers] = useState([
    { answer_text: "", is_correct: false },
    { answer_text: "", is_correct: false },
    { answer_text: "", is_correct: false },
    { answer_text: "", is_correct: false }
  ]);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/admin/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: topicName, description: topicDesc })
      });
      if (res.ok) {
        alert("Topic created!");
        setTopicName(""); setTopicDesc("");
      } else {
        alert("Failed to create topic");
      }
    } catch (err) {
      alert("Error connecting to backend");
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        topic_id: parseInt(topicId),
        question_text: questionText,
        image_url: imageUrl || null,
        answers: answers
      };

      const res = await fetch(`${BASE_URL}/admin/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("Question added!");
        setQuestionText(""); 
        // Keep topicId for fast adding
      } else {
        alert("Failed to add question");
      }
    } catch (err) {
       alert("Error connecting to backend");
    }
  };

  const updateAnswer = (index, field, value) => {
      const newAnswers = [...answers];
      newAnswers[index][field] = value;
      // If setting is_correct to true, we might want to unset others for single-choice MVP
      if (field === "is_correct" && value === true) {
          newAnswers.forEach((a, i) => { if (i !== index) a.is_correct = false; });
      }
      setAnswers(newAnswers);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🛠️ Admin Panel</h1>

      <div style={{ marginTop: "40px", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
        <h2>1. Add Topic</h2>
        <form onSubmit={handleCreateTopic} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input required placeholder="Topic Name (e.g., Road Signs)" value={topicName} onChange={e => setTopicName(e.target.value)} style={{ padding: "10px" }} />
          <input placeholder="Description" value={topicDesc} onChange={e => setTopicDesc(e.target.value)} style={{ padding: "10px" }} />
          <button type="submit" style={{ padding: "10px", background: "#000", color: "#fff", cursor: "pointer" }}>Save Topic</button>
        </form>
      </div>

      <div style={{ marginTop: "40px", padding: "20px", background: "#f0f7ff", borderRadius: "8px" }}>
        <h2>2. Add Question</h2>
        <form onSubmit={handleCreateQuestion} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input required type="number" placeholder="Topic ID (integer)" value={topicId} onChange={e => setTopicId(e.target.value)} style={{ padding: "10px" }} />
          <textarea required placeholder="Question Text" value={questionText} onChange={e => setQuestionText(e.target.value)} style={{ padding: "10px", height: "80px" }} />
          <input placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{ padding: "10px" }} />
          
          <h4 style={{ margin: "10px 0 0 0" }}>Answers (Select the correct one)</h4>
          {answers.map((ans, idx) => (
             <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input type="radio" name="correct_answer" checked={ans.is_correct} onChange={() => updateAnswer(idx, "is_correct", true)} />
                <input required placeholder={`Option ${idx + 1}`} value={ans.answer_text} onChange={e => updateAnswer(idx, "answer_text", e.target.value)} style={{ padding: "10px", flex: 1 }} />
             </div>
          ))}

          <button type="submit" style={{ padding: "15px", background: "#0070f3", color: "#fff", cursor: "pointer", fontWeight: "bold", marginTop: "10px" }}>Save Question</button>
        </form>
      </div>
    </div>
  );
}
