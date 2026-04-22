import { useState } from "react";

function ChatList({ chats, setSelectedChatId }) {
  const [search, setSearch] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          padding: "15px",
          fontSize: "20px",
          fontWeight: "bold",
          borderBottom: "1px solid #ddd",
        }}
      >
        Chats
      </div>

      {/* SEARCH */}
      <div style={{ padding: "10px" }}>
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "90%",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* CHAT ITEMS */}
      {filteredChats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => setSelectedChatId(chat.id)}
          style={{
            padding: "15px",
            borderBottom: "1px solid #eee",
            cursor: "pointer",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{chat.name}</div>
          <small style={{ color: "#666" }}>
            {chat.messages && chat.messages.length > 0
              ? (() => {
                  const last = chat.messages[chat.messages.length - 1];

                  if (last.text) return last.text;
                  if (last.audio) return "🎤 Voice message";
                  
                  if (last.file?.type.startsWith("image/")) return "🖼 Photo";
                  if (last.file?.type.startsWith("video/")) return "🎥 Video";
                  return "";
                })()
              : "Start chatting..."}
          </small>
        </div>
      ))}

      {/* EMPTY */}
      {filteredChats.length === 0 && (
        <div style={{ padding: "15px", color: "#888" }}>
          No chats found
        </div>
      )}
    </div>
  );
}

export default ChatList;