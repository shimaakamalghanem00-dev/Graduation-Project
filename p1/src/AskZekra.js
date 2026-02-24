import React from "react";

function AskZekra({ lang, navigateTo }) {
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
        <h1>{lang === "en" ? "Ask Zekra Page" : "صفحة اسال ذكرى"}</h1>
        <p>{lang === "en" ? "Here for help, Ask Zekra." : "هنا للمساعده اسال ذكرى"}</p>
      </div>
    </div>
  );
}

export default AskZekra;