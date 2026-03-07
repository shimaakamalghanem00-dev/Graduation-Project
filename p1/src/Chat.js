import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

function Chat({ lang, navigateTo }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello 👋", sender: "other", time: "1:20 PM" },
    { id: 2, text: "Hi! How are you?", sender: "me", time: "1:21 PM" },
  ]);
  



  const [newMessage, setNewMessage] = useState("");

  const [showEmoji, setShowEmoji] = useState(false);

  const [isRecording, setIsRecording] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [audioChunks, setAudioChunks] = useState([]);
 
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const onEmojiClick = (emojiData) => {
  setNewMessage((prev) => prev + emojiData.emoji);
  setShowEmoji(false);
};
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const newMsg = {
    id: Date.now(),
    file: file,
    sender: "me",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  setMessages((prev) => [...prev, newMsg]);
};

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    const chunks = [];

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });

      const newMsg = {
        id: Date.now(),
        audio: audioBlob,
        sender: "me",
        time: new Date().toLocaleTimeString(),
        seen: true
      };

      setMessages((prev) => [...prev, newMsg]);
    };

    recorder.start();
    setIsRecording(true);
    setAudioChunks(chunks);

  } catch (error) {
    console.error("Microphone access denied", error);
  }
};
const stopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    setIsRecording(false);
  }
};

useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);



  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f4f6f9",
      }}
    >
      {/* ===== NAVBAR ===== */}
       <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbarbrand fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigateTo("home")}>ZEKRA</span>
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigateTo("home")}
          >
            {lang === "en" ? "Back to Home" : "العودة للرئيسية"}
          </button>
        </div>
      </nav>
</div>
      {/* ===== CHAT CONTAINER (FULL SCREEN) ===== */}
      <div
        className="d-flex flex-column"
        style={{
          height: "calc(100vh - 56px)",
          width: "100%",
          background: "#fff",
        }}
      >
        {/* ===== HEADER ===== */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">

        {/* USER INFO */}
        <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
          <img
            src="https://i.pravatar.cc/150?img=5"
            alt="profile"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />

          <div>
            <div className="fw-bold">Lucinda McGuire</div>
            <small className="text-success">Online</small>
          </div>
        </div>

  {/* ACTION BUTTONS */}
  <div className="d-flex align-items-center gap-2 ms-auto" 
  style={{ display: "flex", alignItems: "center", marginInlineStart: "1400px", gap: "10px" }}
   >

  <button onClick={() => navigateTo("VoiceCall")}
    className="btn btn-light rounded-circle"
    style={{
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    
    <i className="bi bi-telephone"></i>
  </button>
 
  <button
  onClick={() => navigateTo("VideoCall")}
    className="btn btn-light rounded-circle"
    
    style={{
      width: "40px",
      height: "40px",
       display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <i className="bi bi-camera-video"></i>
  </button>
 
  <button
    className="btn btn-light rounded-circle"
    onClick={() => setShowMenu(!showMenu)}
    style={{
      width: "40px",
      height: "40px",
       display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <i className="bi bi-three-dots-vertical"></i>
  </button>
<br></br>
</div>

</div>
         
       {/* ===== MESSAGES AREA ===== */}
<div
  className="flex-grow-1 p-4"
  style={{
    overflowY: "auto",
    backgroundColor: "#f3eef5",
    display: "flex",
    flexDirection: "column",
  }}
>
  {messages.map((msg) => {
    const isSender = msg.sender === "me";

    return (
      <div
        key={msg.id}
        style={{
          display: "flex",
          justifyContent: isSender ? "flex-end" : "flex-start",
          marginBottom: "18px",
          direction: "ltr",
        }}
      >
        <div
          style={{
            backgroundColor: isSender ? "#7c1165" : "#ffffff",
            color: isSender ? "#fff" : "#000",
            padding: "10px 16px",
            borderRadius: "20px",
            maxWidth: "60%",
            width: "fit-content",
            wordBreak: "break-word",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          {/* MESSAGE TEXT */}


          <div>
             

        {msg.audio && (
          <audio
            controls
            src={URL.createObjectURL(msg.audio)}
            style={{
              marginTop: "5px",
              width: "200px"
            }}
          />
        )}
      </div>
                <div>{msg.text}</div>
            {msg.file && (
        msg.file.type.startsWith("image/") ? (
          <img
            src={URL.createObjectURL(msg.file)}
            alt="upload"
            style={{
              maxWidth: "200px",
              borderRadius: "10px",
              marginTop: "5px"
            }}
          />
         ) : (
    <div
      style={{
        padding: "8px",
        background: "#eee",
        borderRadius: "10px",
        marginTop: "5px",
        color: "#000"
      }}
    >
      📎 {msg.file.name}
    </div>
  )
)}

          {/* TIME + SEEN STATUS */}
          
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "5px",
              marginTop: "4px",
            }}
          >
            <small
              style={{
                fontSize: "11px",
                opacity: 0.7,
              }}
            >
              {msg.time}
            </small>

            {isSender && (
              msg.seen ? (
                <i
                  className="bi bi-check2-all"
                  style={{ fontSize: "12px", color: "#4fc3f7" }}
                ></i>
              ) : (
                <i
                  className="bi bi-check2"
                  style={{ fontSize: "12px", opacity: 0.7 }}
                ></i>
              )
            )}
          </div>
        </div>
      </div>
    );
  })}
</div>
    <video
  id="localVideo"
  autoPlay
  playsInline
  style={{
    width: "250px",
    borderRadius: "10px",
    display: "none"
  }}
></video>     
    {/* ===== INPUT AREA ===== */}
    
<div
  style={{
    padding: "12px",
    borderTop: "1px solid #ddd",
    backgroundColor: "#ffffff",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
   <input
  type="file"
  id="fileUpload"
  style={{ display: "none" }}
  onChange={handleFileUpload}
/>
    {/* PLUS BUTTON */}
    <button
  className="btn btn-light rounded-circle"
  onClick={() => document.getElementById("fileUpload").click()}
  style={{
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <i className="bi bi-plus-lg"></i>
</button>

    {/* EMOJI BUTTON */}
    <button
  className="btn btn-light rounded-circle"
  onClick={() => setShowEmoji(!showEmoji)}
  style={{
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <i className="bi bi-emoji-smile"></i>
</button>

    {/* INPUT FIELD */}
    <input
      type="text"
      placeholder={lang === "en" ? "Type your message..." : "اكتب رسالتك..."}
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      style={{
        flex: 1,
        padding: "10px 15px",
        borderRadius: "25px",
        border: "1px solid #ccc",
        outline: "none",
      }}
    />

    {/* SEND / MIC BUTTON */}
    <button
  className="btn btn-primary rounded-circle"
  onClick={
    newMessage.trim()
      ? sendMessage
      : isRecording
      ? stopRecording
      : startRecording
  }
  style={{
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
  {newMessage.trim() ? (
    <i className="bi bi-send"></i>
  ) : isRecording ? (
    <i className="bi bi-stop"></i>
  ) : (
    <i className="bi bi-mic"></i>
  )}
</button>

  </div>
</div>
{showEmoji && (
  <div style={{ position: "absolute", bottom: "70px", left: "20px" }}>
    <EmojiPicker onEmojiClick={onEmojiClick} />
  </div>
)}
{showMenu && (
  <div
    ref={menuRef}
    style={{
      position: "absolute",
      top: "60px",
      right: "20px",
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      width: "180px",
      overflow: "hidden",
      zIndex: 100
    }}
  >
    <div
      style={{ padding: "10px", cursor: "pointer" }}
      onClick={() => alert("Search in chat")}
    >
      🔍 Search in chat
    </div>

    <div
      style={{ padding: "10px", cursor: "pointer" }}
      onClick={() => alert("Edit name")}
    >
      ✏️ Edit name
    </div>

    <div
      style={{ padding: "10px", cursor: "pointer", color: "red" }}
      onClick={() => alert("User blocked")}
    >
      🚫 Block
    </div>
    <div
      style={{ padding: "10px", cursor: "pointer", color: "red" }}
      onClick={() => alert("User blocked")}
    >
      🚫 Unblock 
    </div>
  </div>
)}
     </div>
    </div>
  );
  
}

export default Chat;