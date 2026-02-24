import React from "react";

function AppGuid({ lang, navigateTo }) {
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
        <h1>{lang === "en" ? "App Guidence Page" : "صفحة دليل البرنامج"}</h1>
        <p>{lang === "en" ? "App Guidence for know all knowledge." : "دليل الرنامج لمعرفة كل المعلومات. "}</p>
      </div>
    </div>
  );
}

export default AppGuid;