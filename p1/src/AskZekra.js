import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

export default function ChatBot({ lang, navigateTo }) {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello 👋 How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    // simulate API call
    setTimeout(() => {
      const botReply = {
        role: "bot",
        content: "Thanks for your message: " + userMessage.content
      };

      setMessages(prev => [...prev, botReply]);
      setTyping(false);
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
   <div dir={lang === "ar" ? "rtl" : "ltr"}>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <span
                        className="navbarbrand fw-bold"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigateTo("home")}
                    >
                       ASK ZEKRA
                    </span>
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => navigateTo("home")}
                    >
                        {lang === "en" ? "Back" : "رجوع"}
                    </button>
                </div>
            </nav>


    <div className="chat-container">

      <div className="chat-header">
                
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role}`}
          >
            {msg.content}
          </div>
        ))}

        {typing && <div className="message bot typing">Typing...</div>}

        <div ref={bottomRef} />
      </div>
 
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button onClick={handleSend}  >
          Send
        </button>
      </div>
     </div>
    </div>
  );
}