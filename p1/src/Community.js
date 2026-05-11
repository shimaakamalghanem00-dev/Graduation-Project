import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { FiMic, FiSmile, FiArrowLeft } from "react-icons/fi";

const SENDER_COLORS = [
  "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
  "#2196F3", "#009688", "#FF5722", "#795548",
];

function getSenderColor(name) {
  if (!name) return SENDER_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SENDER_COLORS[Math.abs(hash) % SENDER_COLORS.length];
}

function Community({ lang, navigateTo, onBack, isMobile, currentUser, chats, setChats }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [objectUrls, setObjectUrls] = useState({});
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const messagesEndRef = useRef(null);

  const communityId = "community_group";
  const communityChat = chats?.find((c) => c.id === communityId) || {
    id: communityId,
    name: "Community",
    members: [],
    messages: [],
  };

  const messages = communityChat.messages || [];

  const createSafeObjectURL = (file) => {
    if (!file) return null;
    if (file instanceof Blob || file instanceof File) {
      try {
        return URL.createObjectURL(file);
      } catch (error) {
        console.error("Error creating object URL:", error);
        return null;
      }
    }
    console.warn("Invalid file/blob object:", file);
    return null;
  };

  useEffect(() => {
    return () => {
      Object.values(objectUrls).forEach(url => {
        if (url) {
          try {
            URL.revokeObjectURL(url);
          } catch (error) {
            console.error("Error revoking object URL:", error);
          }
        }
      });
    };
  }, []);

  useEffect(() => {
    const newUrls = {};
    messages.forEach(msg => {
      if (msg.file && (msg.file instanceof Blob || msg.file instanceof File)) {
        const key = msg.id + '_file';
        if (!objectUrls[key]) {
          newUrls[key] = createSafeObjectURL(msg.file);
        }
      }
      if (msg.audio && (msg.audio instanceof Blob || msg.audio instanceof File)) {
        const key = msg.id + '_audio';
        if (!objectUrls[key]) {
          newUrls[key] = createSafeObjectURL(msg.audio);
        }
      }
    });

    Object.keys(objectUrls).forEach(key => {
      if (!newUrls[key]) {
        try {
          URL.revokeObjectURL(objectUrls[key]);
        } catch (error) {
          console.error("Error revoking old URL:", error);
        }
      }
    });
    
    if (Object.keys(newUrls).length > 0) {
      setObjectUrls(prev => ({ ...prev, ...newUrls }));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        if (chunksRef.current.length === 0) return;
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        addMessage({
          id: Date.now(),
          audio: audioBlob,
          sender: "me",
          senderName: currentUser?.name || "You",
          senderPhoto: currentUser?.profilePhoto || "https://cutiedp.com/wp-content/uploads/2025/08/no-dp-image-5.webp",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          seen: false,
        });
        chunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteMessage = (msgId) => {
    if (objectUrls[msgId + '_file']) {
      try {
        URL.revokeObjectURL(objectUrls[msgId + '_file']);
      } catch (error) {
        console.error("Error revoking file URL:", error);
      }
    }
    if (objectUrls[msgId + '_audio']) {
      try {
        URL.revokeObjectURL(objectUrls[msgId + '_audio']);
      } catch (error) {
        console.error("Error revoking audio URL:", error);
      }
    }
    
    if (setChats) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === communityId
            ? { ...chat, messages: chat.messages.filter((m) => m.id !== msgId) }
            : chat
        )
      );
    }
  };

  const addMessage = (newMsg) => {
    if (newMsg.file && !(newMsg.file instanceof Blob) && !(newMsg.file instanceof File)) {
      console.error("Invalid file in message:", newMsg.file);
      delete newMsg.file;
    }
    if (newMsg.audio && !(newMsg.audio instanceof Blob) && !(newMsg.audio instanceof File)) {
      console.error("Invalid audio in message:", newMsg.audio);
      delete newMsg.audio;
    }

    if (setChats) {
      setChats((prev) => {
        const existingChat = prev.find((c) => c.id === communityId);
        if (existingChat) {
          return prev.map((chat) =>
            chat.id === communityId
              ? { ...chat, messages: [...chat.messages, newMsg] }
              : chat
          );
        } else {
          return [...prev, { id: communityId, name: "Community", messages: [newMsg] }];
        }
      });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    addMessage({
      id: Date.now(),
      text: newMessage,
      sender: "me",
      senderName: currentUser?.name || "You",
      senderPhoto: currentUser?.profilePhoto || "https://cutiedp.com/wp-content/uploads/2025/08/no-dp-image-5.webp",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      seen: false,
    });
    setNewMessage("");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    
    if (!(file instanceof File)) {
      console.error("Uploaded file is not a valid File object");
      return;
    }
    
    addMessage({
      id: Date.now(),
      file: file,
      sender: "me",
      senderName: currentUser?.name || "You",
      senderPhoto: currentUser?.profilePhoto || "https://cutiedp.com/wp-content/uploads/2025/08/no-dp-image-5.webp",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      seen: false,
    });
    
    
    event.target.value = '';
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

      {/* header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 15px",
        borderBottom: "1px solid #ddd",
        background: "#fff",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Back */}
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px",
              margin: 0,
              width: "auto",
            }}
          >
            <FiArrowLeft size={24} color="#333" />
          </button>

          {/* group icon */}
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6BABE0, #9B8FD9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            color: "white",
            flexShrink: 0,
          }}>
            👥
          </div>

          <div>
            <div style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>
              {lang === "en" ? "Community" : "المجتمع"}
            </div>
            <div style={{ fontSize: "11px", color: "#888" }}>
              {lang === "en" ? "Support Group" : "مجموعة الدعم"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigateTo("VoiceCallCommunity")}
            className="btn btn-light rounded-circle"
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              margin: 0,
            }}
          >
            <i className="bi bi-telephone"></i>
          </button>

          <button
            onClick={() => navigateTo("VideoCallCommunity")}
            className="btn btn-light rounded-circle"
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              margin: 0,
            }}
          >
            <i className="bi bi-camera-video"></i>
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{
        flex: 1,
        padding: "20px",
        overflowY: "auto",
        background: "#f1ebeb",
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", marginTop: "50px" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>💬</div>
            <div>{lang === "en" ? "Start chatting with the community!" : "ابدأ الدردشة مع المجتمع!"}</div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender === "me";
            const senderColor = getSenderColor(msg.senderName);
            const prevMsg = messages[index - 1];
            const isSameSender = prevMsg && prevMsg.sender === msg.sender && prevMsg.senderName === msg.senderName;
            
            
            const fileUrl = objectUrls[msg.id + '_file'];
            const audioUrl = objectUrls[msg.id + '_audio'];

            return (
              <div
                key={msg.id}
                onDoubleClick={() => deleteMessage(msg.id)}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  gap: "8px",
                  marginBottom: isSameSender ? "4px" : "12px",
                  cursor: "pointer",
                }}
              >
                {!isMe && (
                  <div style={{ width: "30px", flexShrink: 0 }}>
                    {!isSameSender && (
                      <img
                        src={msg.senderPhoto || "https://cutiedp.com/wp-content/uploads/2025/08/no-dp-image-5.webp"}
                        alt={msg.senderName}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                )}

                <div style={{
                  background: isMe ? "#dca1fa" : "#901ee7",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  maxWidth: "70%",
                  width: "fit-content",
                  display: "inline-block",
                }}>
                  {/* sender name */}
                  {!isMe && !isSameSender && (
                    <div style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: senderColor,
                      marginBottom: "3px",
                    }}>
                      {msg.senderName}
                    </div>
                  )}

                  <div>
                    {msg.text && (
                      <div style={{ color: isMe ? "#333" : "#fff" }}>{msg.text}</div>
                    )}

                    {msg.file && msg.file.type?.startsWith("image/") && fileUrl && (
                      <img
                        src={fileUrl}
                        alt="sent"
                        style={{ maxWidth: "200px", borderRadius: "10px", marginTop: "5px" }}
                        onError={(e) => {
                          console.error("Failed to load image for message:", msg.id);
                          e.target.style.display = "none";
                        }}
                      />
                    )}

                    {msg.file && msg.file.type?.startsWith("video/") && fileUrl && (
                      <video
                        controls
                        src={fileUrl}
                        style={{ maxWidth: "320px", borderRadius: "10px", marginTop: "5px" }}
                        onError={(e) => console.error("Failed to load video for message:", msg.id)}
                      />
                    )}

                    {msg.file && !msg.file.type?.startsWith("image/") && !msg.file.type?.startsWith("video/") && (
                      <div style={{ marginTop: "5px", color: isMe ? "#333" : "#fff" }}>
                        📎 {msg.file.name || "File"}
                      </div>
                    )}

                    {msg.audio && audioUrl && (
                      <audio
                        controls
                        src={audioUrl}
                        style={{ width: "250px", height: "25px" }}
                        onError={(e) => console.error("Failed to load audio for message:", msg.id)}
                      />
                    )}
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "5px",
                  }}>
                    <span style={{ fontSize: "11px", color: isMe ? "#555" : "#ddd" }}>{msg.time}</span>
                    {isMe && <span style={{ fontSize: "12px" }}>{msg.seen ? "✔✔" : "✔"}</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {showEmoji && (
        <div style={{
          position: "absolute",
          bottom: "70px",
          left: "20px",
          zIndex: 1000,
        }}>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}

      <div style={{
        padding: "10px",
        borderTop: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#f0f2f5",
        flexShrink: 0,
      }}>
        <button
          onClick={() => document.getElementById("communityFileUpload").click()}
          style={{
            height: "40px",
            width: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            padding: 0,
            margin: 0,
            flexShrink: 0,
          }}
        >
          +
        </button>

        <button
          onClick={() => setShowEmoji(!showEmoji)}
          style={{
            height: "40px",
            width: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            padding: 0,
            margin: 0,
            flexShrink: 0,
          }}
        >
          <FiSmile size={20} />
        </button>

        <input
          type="file"
          id="communityFileUpload"
          accept="image/*,video/*"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />

        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder={lang === "en" ? "Type a message..." : "اكتب رسالة..."}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "20px",
            border: "1px solid #ddd",
            outline: "none",
            background: "white",
            fontSize: "14px",
            margin: 0,
            width: "auto",
          }}
        />

        <button
          style={{
            height: "40px",
            width: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: "#901ee7",
            color: "white",
            fontSize: "18px",
            padding: 0,
            margin: 0,
            flexShrink: 0,
          }}
          onMouseDown={!newMessage.trim() ? startRecording : null}
          onMouseUp={!newMessage.trim() ? stopRecording : null}
          onClick={newMessage.trim() ? sendMessage : null}
        >
          {newMessage.trim() ? (
            "➤"
          ) : isRecording ? (
            <span style={{ color: "red" }}>●</span>
          ) : (
            <FiMic size={22} color="white" />
          )}
        </button>
      </div>
    </div>
  );
}

export default Community;