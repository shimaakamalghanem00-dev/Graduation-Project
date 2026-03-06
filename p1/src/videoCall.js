import React, { useState } from "react";

function VideoCall({ lang, navigateTo }) {

  const [stream, setStream] = useState(null);

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setStream(mediaStream);
    } catch {
      alert("Camera permission denied");
    }
  };

  const endCall = () => {

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    navigateTo("chat");
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
                        ZEKRA
                    </span>
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => navigateTo("Chat")}
                    >
                        {lang === "en" ? "Back" : "رجوع"}
                    </button>
                </div>
            </nav>
            
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >

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
            objectFit: "cover"
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          gap: "20px"
        }}
      >

        <button className="btn btn-success" onClick={startVideo}>
          Start Camera
        </button>

        <button className="btn btn-danger" onClick={endCall}>
          End Call
        </button>

      </div>
</div>
    </div>
  );
}

export default VideoCall;