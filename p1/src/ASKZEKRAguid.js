function ASKZEKRAguid({ lang, navigateTo }) {
  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbarbrand fw-bold" style={{ cursor: 'pointer' }}    onClick={() => navigateTo("appguid")} >ZEKRA</span>
          <button 
            className="btn btn-outline-primary"
             onClick={() => navigateTo("appguid")}
          >
            {lang === "en" ? "Back to AppGuid" : "العودة الي دليل البرنامج"}
          </button>
        </div>
      </nav>
<div className="container mt-3"> 
      <div class="card">
  <div class="card-body">
     <p className="descrip">
         Ask Zekra is an AI chatbot that you can ask anything on any topic, and it can answer in a simple and understandable way.
         <br/>
         Write what you want in the designated writing area, then press the send button, and the answer to your question will appear.
         </p>
         
         </div>
</div>
</div>

       </div> 
  );
}

export default ASKZEKRAguid;