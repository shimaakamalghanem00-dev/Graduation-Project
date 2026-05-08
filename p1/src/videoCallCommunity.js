import React, { useState } from "react";

function VideoCallCommunity({ lang, navigateTo }) {
  const [stream, setStream] = useState(null);

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
    } catch {
      alert("Camera permission denied");
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    navigateTo("community");
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <div
        style={{
          height: "100vh",
          width: "100%",
          background: "#1f1f1f",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >

        {!stream && (
          <div style={{ textAlign: "center", color: "white", marginBottom: "30px" }}>
            <div
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6BABE0, #9B8FD9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "56px",
                margin: "0 auto 16px",
              }}
            >
              👥
            </div>
            <h2 style={{ color: "white", marginBottom: "8px" }}>Zekra Group</h2>
            <p style={{ color: "#aaa" }}>
              {lang === "en" ? "Group Video Call" : "مكالمة مرئية جماعية"}
            </p>
          </div>
        )}

        {stream && (
          <video
            autoPlay
            playsInline
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        )}

        {/* control buttom*/}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            gap: "20px",
            zIndex: 10,
          }}
        >
          <button className="btn btn-success" onClick={startVideo}>
            {lang === "en" ? "Start Camera" : "بدء الكاميرا"}
          </button>
          <button className="btn btn-danger" onClick={endCall}>
            {lang === "en" ? "End Call" : "إنهاء المكالمة"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default VideoCallCommunity;
