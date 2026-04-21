function ActivityGuid({ lang, navigateTo }) {
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
        The program includes two types of activities: the first is a matching card game, and the second is a Family Tree Memory Game.<br/>
        The first activity consists of three levels: easy, medium, and difficult. Each level contains a number of cards that the player must match correctly to achieve maximum progress.<br/>
        The activity also records the highest progress achieved in any of the stages, whether easy, medium, or difficult.<br/>
        Its benefit is to improve memory, enabling the patient to recall and match the cards correctly. If done correctly, progress remains high; otherwise, it drops by 5 points.<br/>
        To maximize benefit, the results are sent immediately to the family's account so they are aware of their condition and whether it is improving or worsening.
     </p>
  </div>
</div>
</div>

 <div className="container mt-3"> 
      <div class="card">
  <div class="card-body">
     <p className="descrip">
         The second activity is Family Tree Memory Game.<br/>
         The activity involves a collection of photos of family members or friends, and we want to place each one in its place on the tree.<br/>
         This activity helps in remembering people and their names, and it also allows uploading and changing photos from time to time to remember more people.<br/>
         The activity records how many times the activity was performed, and also records the progress made during those times.<br/>
         This activity allows you to reset your progress and start over.<br/>
         These results are also sent to the family's account so they are aware of the progress.
           </p>
  </div>
</div>
</div>
   </div> 
  );
}

export default ActivityGuid;