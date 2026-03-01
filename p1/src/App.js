import React, { useState } from "react";
import Login from "./login";
import Signup from "./signup";
import ForgotPassword from "./ForgotPassword";
import Activities from "./Activities";
import Bracelet from "./Bracelet";
import Chat from "./Chat";
import GPS from "./Gps";
import Memories from "./Memories";
import Reminder from "./Reminder";
import About from "./About";
import Contact from "./Contact";
import SocialLoginModal from "./SocialLoginModal";
import FamilyTreeGame from "./FamilyTreeGame"; 
import MemoryGame from "./MemoryGame"; 
import AskZekra from "./AskZekra";
import AppGuid from "./AppGuid";
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Vmemories from "./Vmemories";
import AllMemories from "./allMemories";
import IMemories from "./iMemories";
import Rmemories from "./Rmemories";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lang, setLang] = useState("en");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState("home");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [socialUsers, setSocialUsers] = useState({
    google: [],
    facebook: []
  });
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialProvider, setSocialProvider] = useState(null);

  const toggleLanguage = () => {
    setLang(lang === "en" ? "ar" : "en");
  };

  const handleLoginSuccess = (email, password) => {
    const userExists = users.some(user => user.email === email && user.password === password);
    
    if (userExists) {
      setIsAuthenticated(true);
    } else {
      alert(lang === "en" ? "Invalid email or password" : "البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  const handleSignupSuccess = (userData) => {
    setUsers([...users, userData]);
    setIsLogin(true);
    alert(lang === "en" ? "Account created successfully! Please login." : "تم إنشاء الحساب بنجاح! الرجاء تسجيل الدخول.");
  };

  const handleForgotPassword = (email) => {
    const userExists = users.some(user => user.email === email);
    
    if (userExists) {
      alert(lang === "en" 
        ? `A reset code has been sent to ${email}` 
        : `تم إرسال رمز إعادة التعيين إلى ${email}`);
      setShowForgotPassword(false);
    } else {
      alert(lang === "en" 
        ? "Email not found. Please sign up first." 
        : "البريد الإلكتروني غير موجود. الرجاء إنشاء حساب أولاً.");
    }
  };

  const handleSocialLogin = (provider) => {
    setSocialProvider(provider);
    setShowSocialModal(true);
  };

  const handleSocialLoginSubmit = (email, password) => {
    const providerUsers = socialUsers[socialProvider];
    const userExists = providerUsers.some(user => user.email === email && user.password === password);
    
    if (userExists) {
      setIsAuthenticated(true);
      setShowSocialModal(false);
    } else {
      alert(lang === "en" ? "Invalid email or password for this account" : "البريد الإلكتروني أو كلمة المرور غير صحيحة لهذا الحساب");
    }
  };

  const handleSocialSignup = (email, password) => {
    setSocialUsers({
      ...socialUsers,
      [socialProvider]: [...socialUsers[socialProvider], { email, password }]
    });
    alert(lang === "en" ? "Account created successfully! Please login." : "تم إنشاء الحساب بنجاح! الرجاء تسجيل الدخول.");
    setShowSocialModal(false);
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const cards = [
    { title: "Activities", ar: "الأنشطة", page: "activities", img: "https://img2.clipart-library.com/28/flashcard-clipart/flashcard-clipart-11.png" },
    { title: "Bracelet", ar: "السوار", page: "bracelet", img: "https://cdn-icons-png.flaticon.com/512/3211/3211516.png" },
    { title: "Chat", ar: "الدردشة", page: "chat", img: "https://cdn-icons-png.freepik.com/512/1180/1180287.png" },
    { title: "GPS", ar: "الموقع", page: "gps", img: "https://img.freepik.com/premium-vector/gps-icon-center-city-map-with-pin-location_99087-93.jpg" },
    { title: "Memories", ar: "الذكريات", page: "memories", img: "https://cdn-icons-png.freepik.com/512/3321/3321396.png" },
    { title: "Reminder", ar: "التذكير", page: "reminder", img: "https://cdn-icons-png.flaticon.com/512/2686/2686454.png" },
    { title: "ASK ZEKRA", ar: "اسأل ذكرى", page: "askzekra", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq3CXTs3vWh4Ia4CS7vcWhxsxUEwbaERuuNw&s.png" },
    { title: "App Guidence", ar: "دليل البرنامج", page: "appguid", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-cJr3EzIfHVIEnCG-Xnn71UrmfDauj-n4Ow&s.png" },
  ];

  const filteredCards = cards.filter(card =>
    card.title.toLowerCase().includes(search.toLowerCase()) ||
    card.ar.includes(search)
  );

  if (showForgotPassword) {
    return (
      <ForgotPassword 
        onBack={() => setShowForgotPassword(false)}
        onSubmit={handleForgotPassword}
        lang={lang}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="app-container">
          <div className="auth-header">
            <button 
              onClick={toggleLanguage}
              className="language-toggle-btn"
            >
              <i className="bi bi-globe2"></i>
              {lang === "en" ? "AR" : "EN"}
            </button>
          </div>
          <div className="card">
            {isLogin ? (
              <Login 
                switchMode={() => setIsLogin(false)} 
                onLoginSuccess={handleLoginSuccess}
                onSocialLogin={handleSocialLogin}
                onForgotPassword={() => setShowForgotPassword(true)}
                lang={lang}
              />
            ) : (
              <Signup 
                switchMode={() => setIsLogin(true)} 
                onSignupSuccess={handleSignupSuccess}
                onSocialLogin={handleSocialLogin}
                lang={lang}
              />
            )}
          </div>
        </div>

        {showSocialModal && (
          <SocialLoginModal
            provider={socialProvider}
            onClose={() => setShowSocialModal(false)}
            onLogin={handleSocialLoginSubmit}
            onSignup={handleSocialSignup}
            lang={lang}
          />
        )}
      </>
    );
  }

  const renderPage = () => {
    switch(currentPage) {
      case "activities":
        return <Activities lang={lang} navigateTo={navigateTo} />;
      case "bracelet":
        return <Bracelet lang={lang} navigateTo={navigateTo} />;
      case "chat":
        return <Chat lang={lang} navigateTo={navigateTo} />;
      case "gps":
        return <GPS lang={lang} navigateTo={navigateTo} />;
      case "memories":
        return <Memories lang={lang} navigateTo={navigateTo} />;
      case "reminder":
        return <Reminder lang={lang} navigateTo={navigateTo} />;
      case "about":
        return <About lang={lang} navigateTo={navigateTo} />;
      case "contact":
        return <Contact lang={lang} navigateTo={navigateTo} />;
      case "familytree":
        return <FamilyTreeGame lang={lang} navigateTo={navigateTo} />;
      case "memorygame": 
        return <MemoryGame lang={lang} navigateTo={navigateTo} />;
      case "askzekra":
        return <AskZekra lang={lang} navigateTo={navigateTo} />;
      case "appguid":
        return <AppGuid lang={lang} navigateTo={navigateTo} />;
        case "iMemories":
         return <IMemories lang={lang} navigateTo={navigateTo} />;
      case "vmemories":
        return <Vmemories lang={lang} navigateTo={navigateTo} />;
      case "rmemories":
        return <Rmemories lang={lang} navigateTo={navigateTo} />;
      case "allmemories":
        return <AllMemories lang={lang} navigateTo={navigateTo} />;
      default:
        return (
          <div dir={lang === "ar" ? "rtl" : "ltr"}>
            <nav className="navbar navbar-light bg-light">
              <div className="container-fluid">
                <div className="navbarbrand fw-bold">ZEKRA</div>
                <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    className="form-control me-2" 
                    type="search" 
                    placeholder={lang === "en" ? "Search" : "بحث"}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </form>
              </div>
            </nav>

            <br />

            <div className="container">
              <div className="cards-wrapper">
                {filteredCards.map((card, index) => (
                  <div key={index}>
                    <div 
                      className={`card h-100 text-center ${search ? "highlight" : ""}`}
                      onClick={() => navigateTo(card.page)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={card.img}
                        className="card-img-top"
                        alt={card.title}
                        style={{ height: "150px", objectFit: "contain", padding: "10px" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">
                          {lang === "en" ? card.title : card.ar}
                        </h5>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredCards.length === 0 && (
                  <div className="text-center mt-5 w-100">
                    <h5>
                      {lang === "en" ? "No results found" : "لا يوجد نتائج"}
                    </h5>
                  </div>
                )}
              </div>
            </div>

            <footer className="bg-dark text-white mt-5">
              <div className="container p-4">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h5 className="fw-bold">ZEKRA</h5>
                    <p>
                      {lang === "en"
                        ? "Memory may fade… but attention never does. ZEKRA is with Alzheimer's patients every step of the way."
                        : "قد تبهت الذاكرة… لكن الاهتمام لا يبهت أبدًا. ذكرى بجانب مرضى الزهايمر في كل خطوة."}
                    </p>
                  </div>

                  <div className="col-md-3 mb-4">
                    <h6 className="fw-bold">
                      {lang === "en" ? "Links" : "روابط"}
                    </h6>
                    <ul className="list-unstyled">
                      <li>
                        <span 
                          className="text-white text-decoration-none"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigateTo("home")}
                        >
                          {lang === "en" ? "Home" : "الرئيسية"}
                        </span>
                      </li>
                      <li>
                        <span 
                          className="text-white text-decoration-none"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigateTo("about")}
                        >
                          {lang === "en" ? "About" : "عن التطبيق"}
                        </span>
                      </li>
                      <li>
                        <span 
                          className="text-white text-decoration-none"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigateTo("contact")}
                        >
                          {lang === "en" ? "Contact" : "تواصل معنا"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="col-md-3 mb-4">
                    <h6 className="fw-bold">
                      {lang === "en" ? "Follow Us" : "تابعنا"}
                    </h6>
                    <div className="mt-3">
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-white me-3"
                      >
                        <i className="bi bi-facebook" style={{ fontSize: "18px", color: "#4267B2" }}></i>
                      </a>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-white me-3"
                      >
                        <i className="bi bi-instagram" style={{ fontSize: "18px", color: "#E1306C" }}></i>
                      </a>
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-white"
                      >
                        <i className="bi bi-twitter" style={{ fontSize: "18px", color: "#1DA1F2" }}></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center p-3 bg-secondary">
                © 2026 ZEKRA. {lang === "en" ? "All Rights Reserved." : "جميع الحقوق محفوظة."}
              </div>
            </footer>
          </div>
        );
    }
  };

  return renderPage();
}

export default App;