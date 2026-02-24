import React from "react";

function Reminder({ lang, navigateTo }) {
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
        <h1>{lang === "en" ? "Reminders" : "التذكيرات"}</h1>
        <p>{lang === "en" ? "Set reminders for medications and appointments." : "ضبط تذكيرات للأدوية والمواعيد."}</p>
      </div>
    </div>
  );
}

export default Reminder;