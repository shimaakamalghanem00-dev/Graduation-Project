import React from "react";

function Bracelet({ lang, navigateTo }) {
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
        <h1>{lang === "en" ? "Bracelet Page" : "صفحة السوار"}</h1>
        <p>{lang === "en" ? "Track your daily steps and health metrics." : "تتبع خطواتك اليومية ومؤشرات صحتك."}</p>
      </div>
    </div>
  );
}

export default Bracelet;