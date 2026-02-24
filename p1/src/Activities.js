import React from "react";

function Activities({ lang, navigateTo }) {
  const memoryGames = [
    {
      title: lang === "en" ? "Family Tree Memory Game" : "لعبة شجرة العائلة",
      description: lang === "en" 
        ? "Match family members to their positions in the tree to improve memory" 
        : "طابق أفراد العائلة مع أماكنهم في الشجرة لتحسين الذاكرة",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      page: "familytree",
    },
    {
      title: lang === "en" ? "Memory Match Game" : "لعبة مطابقة الذاكرة",
      description: lang === "en" 
        ? "Flip cards and match pairs to exercise your brain and improve concentration" 
        : "اقلب البطاقات وطابق الأزواج لتنشيط عقلك وتحسين التركيز",
      image: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
      page: "memorygame",
    }
  ];

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span 
            className="navbarbrand fw-bold" 
            style={{ cursor: 'pointer' }} 
            onClick={() => navigateTo("home")}
          >
            ZEKRA
          </span>
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigateTo("home")}
          >
            {lang === "en" ? "Back to Home" : "العودة للرئيسية"}
          </button>
        </div>
      </nav>

      <div className="container mt-5">
        <h1 className="text-center mb-4" style={{ color: '#4A7B9D', fontWeight: '700' }}>
          {lang === "en" ? "Memory Activities" : "أنشطة تحسين الذاكرة"}
        </h1>
        <p className="text-center text-muted mb-5" style={{ fontSize: '1.1rem' }}>
          {lang === "en" 
            ? "Choose an activity to start training your memory" 
            : "اختر نشاطاً للبدء في تدريب ذاكرتك"}
        </p>

        <div className="row justify-content-center">
          {memoryGames.map((game, index) => (
            <div key={index} className="col-md-6 col-lg-5 mb-4">
              <div 
                className="activity-card"
                onClick={() => navigateTo(game.page)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && navigateTo(game.page)}
              >
                <span className="play-badge">
                  <i className="bi bi-play-fill"></i>
                  {lang === "en" ? "Play Now" : "العب الآن"}
                </span>
                
                <div className="card-img-wrapper">
                  <img 
                    src={game.image} 
                    alt={game.title}
                  />
                </div>
                
                <div className="card-body">
                  <h5 className="card-title">{game.title}</h5>
                  <p className="card-description">{game.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="memory-activities-tip">
          <div className="tip-text">
            <i className="bi bi-lightbulb-fill"></i>
            {lang === "en" 
              ? "Tip: Playing regularly helps strengthen memory connections!" 
              : "نصيحة: اللعب بانتظام يساعد على تقوية روابط الذاكرة!"}
          </div>
        </div>
      </div>
    </div>
  ); 
}

export default Activities;