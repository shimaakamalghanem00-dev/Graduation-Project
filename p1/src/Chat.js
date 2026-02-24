import React from "react";

function Chat({ lang, navigateTo }) {
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
      <div className="container mt-5">
        <h1>{lang === "en" ? "Chat Page" : "صفحة الدردشة"}</h1>
        <p>{lang === "en" ? "Connect with family and caregivers." : "تواصل مع العائلة ومقدمي الرعاية."}</p>
      </div>
    </div>
  );
}

export default Chat;