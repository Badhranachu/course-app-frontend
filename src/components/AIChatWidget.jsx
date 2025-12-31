import { useState, useEffect, useRef } from "react";
import { FiMessageSquare, FiX } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";

export default function AIChatWidget() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userText = input;
  setMessages((prev) => [...prev, { role: "user", text: userText }]);
  setInput("");
  setLoading(true);

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // Send token ONLY if logged in
    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    const res = await fetch("/api/chat/", {
      method: "POST",
      headers,
      body: JSON.stringify({ question: userText }),
    });

    const data = await res.json();

    // 🚫 Guest limit reached
    if (res.status === 403) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.answer },
      ]);
      return;
    }

    // Normal AI reply
    setMessages((prev) => [
      ...prev,
      { role: "ai", text: data.answer },
    ]);

    // // Optional: show remaining guest messages
    // if (data.remaining !== undefined) {
    //   setMessages((prev) => [
    //     ...prev,
    //     {
    //       role: "ai",
    //       text: `Free messages left: ${data.remaining}`,
    //     },
    //   ]);
    // }

  } catch (err) {
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: "AI is temporarily unavailable. Please try again.",
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* 🔵 Floating AI Button */}
      <button
  onClick={() => setOpen(true)}
  className="
    fixed bottom-24 right-6
    stat-gradient-background
    text-white p-4 rounded-full
    shadow-xl z-40
  "
  aria-label="AI Chat"
>
  <FiMessageSquare size={22} />
</button>


      {/* 🟣 Chat Window */}
      {open && (
        <div className="fixed bottom-32 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="stat-gradient-background text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">Nexston AI</span>
            <button onClick={() => setOpen(false)}>
              <FiX />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-md max-w-[85%] ${
                  m.role === "user"
                    ? "bg-indigo-100 ml-auto text-right"
                    : "bg-gray-100"
                }`}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <p className="text-gray-400 text-xs">Nexston AI typing…</p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nexston AI…"
              className="flex-1 border rounded-md px-2 py-1 text-sm"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="stat-gradient-background text-white px-3 rounded-md text-sm disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
