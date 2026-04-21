import { useState, useRef  } from "react";
import EmojiPicker from "emoji-picker-react";
import { FiPhone, FiVideo } from "react-icons/fi";
import { FiMic } from "react-icons/fi";
import { FiSmile } from "react-icons/fi";
import CallControls from "./callcontrol";
function Chat({ chats, setChats, selectedChatId, navigateTo }){
  const currentChat = chats.find((c) => c.id === selectedChatId);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const onEmojiClick = (emojiData) => {
  setNewMessage((prev) => prev + emojiData.emoji);
};
 
  const messages = currentChat?.messages || [];
const [isRecording, setIsRecording] = useState(false);
const [mediaRecorder, setMediaRecorder] = useState(null);
const [audioChunks, setAudioChunks] = useState([]);
  const [newMessage, setNewMessage] = useState("");
 const mediaRecorderRef = useRef(null);
const chunksRef = useRef([]);


const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const recorder = new MediaRecorder(stream);

  chunksRef.current = [];  

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunksRef.current.push(e.data);
    }
  };

  recorder.onstop = () => {
    if (chunksRef.current.length === 0) return;  

    const audioBlob = new Blob(chunksRef.current, {
      type: "audio/webm",
    });

    const newMsg = {
      id: Date.now(),
      audio: audioBlob,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      seen: false,
    };

    addMessage(newMsg);  

    chunksRef.current = [];  
  };

  recorder.start();

  mediaRecorderRef.current = recorder;
  setIsRecording(true);
};


const stopRecording = () => {
  if (
    mediaRecorderRef.current &&
    mediaRecorderRef.current.state !== "inactive"
  ) {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }
};

const deleteMessage = (msgId) => {
  setChats((prev) =>
    prev.map((chat) =>
      chat.id === selectedChatId
        ? {
            ...chat,
            messages: chat.messages.filter((m) => m.id !== msgId),
          }
        : chat
    )
  );
};


const sendBtn = {
   height:"50px",
   width:"1300px",
  justifyContent: "center",
  alignItems: "center",
                 
     
   
    
};

const addMessage = (newMsg) => {
  setChats((prev) =>
    prev.map((chat) =>
      chat.id === selectedChatId
        ? {
            ...chat,
            messages: [...chat.messages, newMsg],
          }
        : chat
    )
  );
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
    seen: false,
  };

 
  addMessage(newMsg);

  setNewMessage("");
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const newMsg = {
    id: Date.now(),
    file,
    sender: "me",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  addMessage(newMsg);
};
 

 

 
  return (
    
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
     <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // 🔥 KEY
    padding: "10px 15px",
    borderBottom: "1px solid #ddd",
    
    color: "#fff",
  }}
>

  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
 {/* PROFILE IMAGE */}
  <img
    src="https://cutiedp.com/wp-content/uploads/2025/08/no-dp-image-5.webp"  // 🔥 temporary avatar
    alt="profile"
    style={{
      width: "40px",
      height: "40px",
      borderRadius: "50%",    
      objectFit: "cover",
    }}
  />

  {/* NAME */}
  <div style={{ fontWeight: "bold", fontSize: "16px" }}>
    {currentChat?.name}
  </div>

</div>

  {/* RIGHT: CALL BUTTONS */}
  <div style={{ display: "flex", gap: "10px" }}>

    <button
      onClick={() => navigateTo("VoiceCall")}
      className="btn btn-light rounded-circle"
      style={{
        width: "36px",
        height: "36px",
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
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <i className="bi bi-camera-video"></i>
    </button>

  </div>
</div>

      {/* MESSAGES */}
       
        <div
    style={{
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    background: "#f1ebeb",
  }}
>
  {messages.length === 0 ? (
    <div style={{ textAlign: "center", color: "#888" }}>
      Start chatting 💬
    </div>
  ) : (
    messages.map((msg) => {
      const isMe = msg.sender === "me";

      return (
        <div
  key={msg.id}
  onDoubleClick={() => deleteMessage(msg.id)} 
  style={{
    display: "flex",
    justifyContent: isMe ? "flex-end" : "flex-start",
    marginBottom: "10px",
    cursor: "pointer",
  }}
  
>
  
          <div
            style={{
              background: isMe ? "#dca1fa" : "#901ee7",
              padding: "8px 10px",
              borderRadius: "12px",
              maxWidth: "80%",    
              width: "fit-content",       
              display: "inline-block",
            }}
          >
            {/* TEXT + AUDIO */}
            <div>
             <div>
  
  {msg.text && <div>{msg.text}</div>}

   
  {msg.file && msg.file.type.startsWith("image/") && (
    <img
      src={URL.createObjectURL(msg.file)}
      alt="sent"
      style={{
        maxWidth: "200px",
        borderRadius: "10px",
        marginTop: "5px",
      }}
    />
  )}

   
  {msg.file && msg.file.type.startsWith("video/") && (
    <video
      controls
      src={URL.createObjectURL(msg.file)}
      style={{
       maxWidth: "320px",
        borderRadius: "10px",
        marginTop: "5px",
      }}
    />
  )}

 
   

  {/* 📎 OTHER FILE */}
  {msg.file &&
    !msg.file.type.startsWith("image/") &&
    !msg.file.type.startsWith("video/") && (
      <div style={{ marginTop: "5px" }}>
        📎 {msg.file.name}
      </div>
    )}
</div>

              {msg.audio && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            maxWidth: "300px",     // 🔥 smaller width
          }}
        >
          <audio
            controls
            src={URL.createObjectURL(msg.audio)}
            style={{
              width: "250px",
              height: "25px",      // 🔥 smaller height
            }}
          />
        </div>
)}
            </div>

            {/* TIME + STATUS */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "5px",
                marginTop: "5px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#555" }}>
                {msg.time}
              </span>

              {isMe && (
                <span style={{ fontSize: "12px" }}>
                  {msg.seen ? "✔✔" : "✔"}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    })
  )}
</div>
      {/* INPUT */}
      {showEmoji && (
  <div
    style={{
      position: "absolute",
      bottom: "70px",
      left: "20px",
      zIndex: 1000,
    }}
  >
    <EmojiPicker onEmojiClick={onEmojiClick} />
  </div>
)}
      <div
  style={{

     
    padding: "10px",
    borderTop: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f0f2f5",
  }}
>
  
  <button onClick={() => document.getElementById("fileUpload").click()} style={{
        height:"50px",
   width:"1300px",             
    justifyContent: "center",      
    alignItems: "center",          

    border: "none",
    cursor: "pointer",
     
    }} >
  +
</button>
   
  <button onClick={() => setShowEmoji(!showEmoji)} style={{
        height:"50px",
   width:"1300px",
                     
    justifyContent: "center",      
    alignItems: "center",          

    border: "none",
    cursor: "pointer",
     
    }} >
    <FiSmile size={20}  />
     
</button>
<input
  type="file"
  id="fileUpload"
  accept="image/*,video/*"
  style={{ display: "none" }}
  onChange={handleFileUpload}
/>


 



  {/* INPUT */}
   
<input
  value={newMessage}  
  onChange={(e) => setNewMessage(e.target.value)}  
  placeholder="Type a message..."
  style={{width:"20000px"}}
/>
  {/* SEND / MIC */}
  <button
  style={sendBtn}
  onMouseDown={!newMessage.trim() ? startRecording : null}
  onMouseUp={!newMessage.trim() ? stopRecording : null}
  onClick={newMessage.trim() ? sendMessage : null}
    
>
  {newMessage.trim() ? "➤" : isRecording ?(<span style={{ color: "red" }}>●</span>
)  : <FiMic size={22}  color="white" />}
</button>
</div>
    </div>
  );
}
export default Chat;