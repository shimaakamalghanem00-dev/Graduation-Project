import { useState, useEffect } from "react";
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

  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBackToList = () => {
    setShowChat(false);
  };

  if (!isMobile) {
    return (
      <div dir={lang === "ar" ? "rtl" : "ltr"} style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <nav className="navbar navbar-light bg-light" style={{ flexShrink: 0 }}>
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

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* LEFT */}
          <div style={{ width: "30%", borderRight: "1px solid #ddd", overflow: "auto" }}>
            <ChatList
              chats={chats}
              setSelectedChatId={handleSelectChat}
            />
          </div>

           {/* RIGHT */}
          <div style={{ width: "70%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {selectedChatId ? (
              <Chat
                chats={chats}
                setChats={setChats}
                selectedChatId={selectedChatId}
                navigateTo={navigateTo}
                onBack={handleBackToList}
                isMobile={false}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888" }}>
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mobile
  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <nav className="navbar navbar-light bg-light" style={{ flexShrink: 0 }}>
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

      <div style={{ flex: 1, overflow: "hidden" }}>
        {!showChat ? (
          <ChatList
            chats={chats}
            setSelectedChatId={handleSelectChat}
          />
        ) : (
          <Chat
            chats={chats}
            setChats={setChats}
            selectedChatId={selectedChatId}
            navigateTo={navigateTo}
            onBack={handleBackToList}
            isMobile={true}
          />
        )}
      </div>
    </div>
  );
}

export default ChatLayout;