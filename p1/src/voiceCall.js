import React, { useState } from "react";
import Chat from "./Chat";
function VoiceCall({ navigateTo }) {

  const [stream, setStream] = useState(null);

  const startVoice = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      setStream(mediaStream);

    } catch {
      alert("Microphone permission denied");
    }
  };

  const endCall = () => {

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    navigateTo("chat");
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
        alignItems: "center"
      }}
    >

      {/* Avatar */}
      <img
        src="https://cutiedp.com/wp-content/uploads/2025/08/no-dp-image-5.webp"
        alt="profile"
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          marginBottom: "20px"
        }}
      />

      <h2>Ahmed</h2>
      <p>Voice Call</p>

      {/* Buttons */}
      <div style={{ marginTop: "40px", display: "flex", gap: "20px" }}>

        <button
          className="btn btn-success"
          onClick={startVoice}
        >
          Start Call
        </button>

        <button
          className="btn btn-danger"
          onClick={endCall}
        >
          End Call
        </button>

      </div>

    </div>
  );
}

export default VoiceCall;