export default function LandingPage() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ padding: "50px 0" }}>
        <h1 style={{ fontSize: "48px", color: "#333" }}>Pass your driving test in 7 days</h1>
        <p style={{ fontSize: "20px", color: "#666", marginTop: "10px" }}>AI-powered preparation for Uzbekistan exams</p>
        <a href="/dashboard">
          <button style={{ marginTop: "30px", padding: "15px 40px", fontSize: "18px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Start Practice</button>
        </a>
      </header>

      <section style={{ display: "flex", justifyContent: "center", gap: "40px", margin: "40px 0", color: "#555" }}>
        <div><strong>10,000+</strong> tests taken</div>
        <div><strong>85%</strong> pass rate</div>
      </section>

      <section style={{ margin: "80px 0" }}>
        <h2>How It Works</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" }}>
          <div style={{ flex: 1, padding: "20px", background: "#f9f9f9", borderRadius: "10px" }}>1. Take a test</div>
          <div style={{ flex: 1, padding: "20px", background: "#f9f9f9", borderRadius: "10px" }}>2. AI finds weak areas</div>
          <div style={{ flex: 1, padding: "20px", background: "#f9f9f9", borderRadius: "10px" }}>3. Practice smarter</div>
        </div>
      </section>

      <section style={{ margin: "80px 0" }}>
        <h2>Pricing Plans</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" }}>
          <div style={{ flex: 1, padding: "30px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h3>2 Weeks</h3>
            <p>Short-term sprint.</p>
            <button style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }}>Select Plan</button>
          </div>
          <div style={{ flex: 1, padding: "30px", border: "2px solid #0070f3", borderRadius: "10px", transform: "scale(1.05)", background: "#f0f7ff" }}>
            <h3>1 Month ⭐</h3>
            <p>Most popular format.</p>
            <button style={{ padding: "10px 20px", marginTop: "20px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Select Plan</button>
          </div>
          <div style={{ flex: 1, padding: "30px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h3>1 Year</h3>
            <p>For slow learners.</p>
            <button style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }}>Select Plan</button>
          </div>
        </div>
      </section>
    </div>
  );
}
