"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchPracticeQuestions } from '@/utils/api';

export default function PracticePage() {
  const router = useRouter();
  const [weaknessLabel, setWeaknessLabel] = useState("Loading AI data...");
  const [loading, setLoading] = useState(true);

  // Mock user
  const dummyUserId = "00000000-0000-0000-0000-000000000000";

  useEffect(() => {
    async function initPracticeData() {
      try {
        const qList = await fetchPracticeQuestions(dummyUserId);
        
        // MVP Logic: If backend works but data is empty or generic, we guess the label.
        // In full version, backend should explicitly return { topicName, questions }
        if (qList.length > 0) {
            setWeaknessLabel("Based on your history, you are struggling. Let's fix that.");
        } else {
            setWeaknessLabel("Not enough data. Take a random practice quiz!");
        }
        setLoading(false);
      } catch (e) {
        console.warn("Backend not reachable or seeded yet.");
        setWeaknessLabel("Failed to connect to AI service. Ensure database is running.");
        setLoading(false);
      }
    }
    
    initPracticeData();
  }, []);

  const startAIPractice = () => {
    // For MVP, router pushes to a general exam that we would pass query params to.
    router.push('/exam?mode=practice');
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Practice</h1>
      <div style={{ backgroundColor: "#e6f7ff", padding: "20px", borderRadius: "10px", marginTop: "20px", transition: "all 0.3s" }}>
        <h2>AI Recommendation 🧠</h2>
        <p><strong>{weaknessLabel}</strong></p>
        <button 
          onClick={startAIPractice}
          disabled={loading}
          style={{ 
              marginTop: "10px", 
              padding: "10px 20px", 
              fontSize: "16px", 
              backgroundColor: loading ? "#ccc" : "#0070f3", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              cursor: loading ? "not-allowed" : "pointer" 
            }}>
            {loading ? "Analyzing..." : "Start AI Practice"}
        </button>
      </div>

      <h3 style={{ marginTop: "40px" }}>Or choose a topic manually:</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <button style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer", background: "white", textAlign: "left" }}>Road Signs</button>
        <button style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer", background: "white", textAlign: "left" }}>Priority Rules</button>
        <button style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer", background: "white", textAlign: "left" }}>Penalties</button>
        <button style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer", background: "white", textAlign: "left" }}>First Aid</button>
      </div>
    </div>
  );
}
