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
  <div className="container mt-5"> <h1 className="appguid">{lang === "en" ? "App Guidence Page" : "صفحة دليل البرنامج"}</h1> 
  <p className="textguid">{lang === "en" ? "Zekra supports your memory and keeps your most beautiful moments safe forever." : "يدعم تطبيق ذكرى ذاكرتك ويحفظ أجمل لحظاتك آمنة إلى الأبد."}</p> </div>

<div className="container mt-4">

  <div className="mb-4">
    <div className="card"  >
      <div className="card-body" onClick={() => navigateTo("ActivityGuid")}>
        <h5 className="card-title">Activities</h5>
      <p className="card-text">
         Activities help improve memory and make remembering moments easier and clearer.
      </p>
      <a href="#" className="btn btn-primary">Watch Video</a>
    
      </div>
    </div>
  </div>
</div>

<div className="container mt-4">

  <div className="mb-4">
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Bracelet</h5>
      <p className="card-text">
        With supporting text below as a natural lead-in to additional content.
      </p>
      <a href="#" className="btn btn-primary">Watch Video</a>
    
      </div>
    </div>
  </div>
</div>

<div className="container mt-4">

  <div className="mb-4">
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">CHAT</h5>
      <p className="card-text">
        With supporting text below as a natural lead-in to additional content.
      </p>
      <a href="#" className="btn btn-primary">Watch Video</a>
    
      </div>
    </div>
  </div>
</div>

<div className="container mt-4">

  <div className="mb-4">
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">GPS</h5>
      <p className="card-text">
        With supporting text below as a natural lead-in to additional content.
      </p>
      <a href="#" className="btn btn-primary">Watch Video</a>
    
      </div>
    </div>
  </div>
</div>

<div className="container mt-4">

  <div className="mb-4">
    <div className="card" onClick={() => navigateTo("Memoriesguid")}>
      <div className="card-body">
        <h5 className="card-title">Memories</h5>
      <p className="card-text">
         Memories… captured, protected, and always within reach.
      </p>
      <a href="#" className="btn btn-primary">Watch Video</a>
    
      </div>
    </div>
  </div>
</div>

<div className="container mt-4">

  <div className="mb-4">
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Reminder</h5>
      <p className="card-text">
        With supporting text below as a natural lead-in to additional content.
      </p>
      <a href="#" className="btn btn-primary">Watch Video</a>
    
      </div>
    </div>
  </div>
</div>


<div className="container mt-4">

  <div className="mb-4">
    <div className="card" onClick={() => navigateTo("ASKZEKRAguid")}>
      <div className="card-body">
        <h5 className="card-title">ASK ZEKRA</h5>
      <p className="card-text">
         ASK ZEKRA is your smart AI assistant ask anything, get instant answers, and explore ideas anytime.
      </p>
      <a href="#" className="btn btn-primary">Watch Video</a>
    
      </div>
    </div>
  </div>
</div>

 
</div>
    
  );
}

export default AppGuid;