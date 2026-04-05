export default function ResultsPage() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h1>Exam Results</h1>
      <div style={{ fontSize: "48px", fontWeight: "bold", margin: "20px 0" }}>14/20</div>
      <p style={{ fontSize: "18px" }}>You’re close — you need 16 to pass!</p>
      
      <div style={{ textAlign: "left", marginTop: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
        <h3>Weak Topics to Focus On:</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>Road Signs (40% accuracy)</li>
          <li style={{ padding: "10px 0" }}>Priority Rules (50% accuracy)</li>
        </ul>
      </div>

      <div style={{ marginTop: "30px", display: "flex", gap: "10px", flexDirection: "column" }}>
        <a href="/practice"><button style={{ padding: "15px", width: "100%", fontSize: "16px", backgroundColor: "#00a152", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>🧠 Practice Weak Areas</button></a>
        <a href="/exam"><button style={{ padding: "15px", width: "100%", fontSize: "16px", backgroundColor: "#fff", color: "#333", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer" }}>🔁 Retake Exam</button></a>
      </div>
    </div>
  );
}
