export default function DashboardPage() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Dashboard</h1>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px", flex: 1 }}>
          <h2>Progress</h2>
          <p>You are 65% ready to pass!</p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px", flex: 1 }}>
          <h2>Weak Topics</h2>
          <ul>
            <li>Road Signs ❌</li>
            <li>Priority Rules ⚠️</li>
          </ul>
        </div>
      </div>
      <div style={{ marginTop: "30px", display: "flex", gap: "10px", flexDirection: "column", maxWidth: "300px" }}>
        <a href="/exam"><button style={{ padding: "15px", fontSize: "16px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>▶ Start Exam</button></a>
        <a href="/practice"><button style={{ padding: "15px", fontSize: "16px", backgroundColor: "#00a152", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>🧠 Practice Weak Areas</button></a>
      </div>
    </div>
  );
}
