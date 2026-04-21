import { useState } from "react";
import Chat from "./Chat";
import ChatList from "./ChatList";

function ChatLayout({ lang, navigateTo }) {
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Ahmed",
      messages: [],
    },
  ]);

  const [selectedChatId, setSelectedChatId] = useState(1);

  
  return (
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

      {/* 🔽 MAIN CHAT LAYOUT */}
      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
         

        {/* LEFT */}
        <div style={{ width: "30%", borderRight: "1px solid #ddd" }}>
          <ChatList
            chats={chats}
            setSelectedChatId={setSelectedChatId}
          />
        </div>

        {/* RIGHT */}
        <div style={{ width: "70%" }}>
          <Chat
  chats={chats}
  setChats={setChats}
  selectedChatId={selectedChatId}
  navigateTo={navigateTo}    
/>
           
        </div>


      </div>
    </div>
  );
}

export default ChatLayout;