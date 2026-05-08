import React, { useState } from "react";

function VoiceCallCommunity({ lang, navigateTo }) {
  const [stream, setStream] = useState(null);

  const startVoice = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
    } catch {
      alert("Microphone permission denied");
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    navigateTo("community");
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "#1f1f1f",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* groub icon*/}
      <div
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6BABE0, #9B8FD9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "64px",
          marginBottom: "20px",
        }}
      >
        👥
      </div>

      <h2 style={{ color: "white", marginBottom: "8px" }}>Zekra Group</h2>
      <p style={{ color: "#aaa", marginBottom: "0" }}>
        {lang === "en" ? "Group Voice Call" : "مكالمة صوتية جماعية"}
      </p>

      {stream && (
        <p style={{ color: "#25D366", marginTop: "12px", fontSize: "14px" }}>
          {lang === "en" ? "🎙 Microphone active" : "🎙 الميكروفون نشط"}
        </p>
      )}

      <div style={{ marginTop: "40px", display: "flex", gap: "20px" }}>
        <button className="btn btn-success" onClick={startVoice}>
          {lang === "en" ? "Start Call" : "بدء المكالمة"}
        </button>
        <button className="btn btn-danger" onClick={endCall}>
          {lang === "en" ? "End Call" : "إنهاء المكالمة"}
        </button>
      </div>
    </div>
  );
}

export default VoiceCallCommunity;
