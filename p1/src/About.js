import React from "react";

function About({ lang, navigateTo }) {
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
        <h1>{lang === "en" ? "About ZEKRA" : "عن ذكرى"}</h1>
        <p>{lang === "en" ? "ZEKRA helps Alzheimer's patients stay connected and safe." : "ذكرى تساعد مرضى الزهايمر على البقاء على اتصال وآمنين."}</p>
      </div>
    </div>
  );
}

export default About;