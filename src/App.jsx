import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    setLoading(true);
    setReply("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    setReply(data.reply || JSON.stringify(data));
    setLoading(false);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Woody Calculus AI (Backend Test)</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
        style={{ width: 300, padding: 8 }}
      />

      <br /><br />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>

      <pre style={{ marginTop: 20 }}>{reply}</pre>
    </div>
  );
}

export default App;
