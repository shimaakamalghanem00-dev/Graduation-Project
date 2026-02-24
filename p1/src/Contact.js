import React from "react";

function Contact({ lang, navigateTo }) {
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
        <h1>{lang === "en" ? "Contact Us" : "تواصل معنا"}</h1>
        <p>{lang === "en" ? "Email: support@zekra.com - Phone: 01002198052" : "البريد الإلكتروني: support@zekra.com - الهاتف: 01002198052  "}</p>
      </div>
    </div>
  );
}

export default Contact;