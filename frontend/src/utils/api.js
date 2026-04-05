const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchQuestions(topicId = null) {
  const url = topicId ? `${BASE_URL}/questions?topic_id=${topicId}` : `${BASE_URL}/questions`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

export async function fetchRandomQuestions(limit = 20) {
  const res = await fetch(`${BASE_URL}/questions/random?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch random questions");
  return res.json();
}

export async function fetchPracticeQuestions(userId) {
  const res = await fetch(`${BASE_URL}/practice/personalized?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch practice questions");
  return res.json();
}

export async function startExam(userId) {
  const res = await fetch(`${BASE_URL}/exam/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });
  if (!res.ok) throw new Error("Failed to start exam");
  return res.json();
}

export async function submitExam(sessionId, answers) {
  const res = await fetch(`${BASE_URL}/exam/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, answers })
  });
  if (!res.ok) throw new Error("Failed to submit exam");
  return res.json();
}

export async function fetchProgress(userId) {
  const res = await fetch(`${BASE_URL}/progress/?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
}

export async function fetchTopicProgress(userId) {
  const res = await fetch(`${BASE_URL}/progress/topics?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch topic progress");
  return res.json();
}
