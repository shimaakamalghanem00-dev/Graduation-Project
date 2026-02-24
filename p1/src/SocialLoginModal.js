import React, { useState, useEffect } from "react";

export default function SocialLoginModal({ provider, onClose, onLogin, onSignup, lang }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUpperAndLower: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const providerName = provider === "google" ? "Google" : "Facebook";
  const providerColor = provider === "google" ? "#DB4437" : "#4267B2";
  const providerIcon = provider === "google" ? "bi bi-google" : "bi bi-facebook";

  useEffect(() => {
    const minLength = password.length >= 8;
    const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    setPasswordCriteria({
      minLength,
      hasUpperAndLower,
      hasNumber,
      hasSpecialChar,
    });
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      if (!email || !password) {
        alert(lang === "en" ? "Please fill all fields" : "الرجاء ملء جميع الحقول");
        return;
      }
      onLogin(email, password);
    } else {
      if (!email || !password || !confirmPassword) {
        alert(lang === "en" ? "Please fill all fields" : "الرجاء ملء جميع الحقول");
        return;
      }
      if (password !== confirmPassword) {
        alert(lang === "en" ? "Passwords do not match!" : "كلمات المرور غير متطابقة!");
        return;
      }

      if (!Object.values(passwordCriteria).every(criteria => criteria)) {
        alert(lang === "en" ? "Password does not meet all security requirements!" : "كلمة المرور لا تستوفي جميع متطلبات الأمان!");
        return;
      }
      onSignup(email, password);
    }
  };

  const translations = {
    en: {
      loginTitle: `Login with ${providerName}`,
      signupTitle: `Sign up with ${providerName}`,
      email: "Email",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      login: "Login",
      signUp: "Sign Up",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      criteria: {
        minLength: "At least 8 characters",
        upperLower: "Uppercase and lowercase letters",
        number: "At least one number",
        specialChar: "At least one special character (@$*#&)"
      }
    },
    ar: {
      loginTitle: `تسجيل الدخول مع ${providerName === "Google" ? "جوجل" : "فيسبوك"}`,
      signupTitle: `إنشاء حساب مع ${providerName === "Google" ? "جوجل" : "فيسبوك"}`,
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      password: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      confirmPasswordPlaceholder: "أكد كلمة المرور",
      login: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      noAccount: "ليس لديك حساب؟",
      haveAccount: "لديك حساب بالفعل؟",
      criteria: {
        minLength: "8 أحرف على الأقل",
        upperLower: "أحرف كبيرة وصغيرة",
        number: "رقم واحد على الأقل",
        specialChar: "رمز خاص واحد على الأقل (@$*#&)"
      }
    }
  };

  const t = translations[lang];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ backgroundColor: providerColor }}>
          <i className={providerIcon} style={{ fontSize: "24px", color: "white" }}></i>
          <h3 style={{ color: "white", margin: 0 }}>
            {isLogin ? t.loginTitle : t.signupTitle}
          </h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
              />
            </div>

            <div className="form-group">
              <label>{t.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                required
              />
              
              {!isLogin && (
                <div className="password-criteria">
                  <div className="criteria-item">
                    <span className={`criteria-icon ${passwordCriteria.minLength ? 'met' : ''}`}></span>
                    <span className="criteria-text">{t.criteria.minLength}</span>
                  </div>
                  <div className="criteria-item">
                    <span className={`criteria-icon ${passwordCriteria.hasUpperAndLower ? 'met' : ''}`}></span>
                    <span className="criteria-text">{t.criteria.upperLower}</span>
                  </div>
                  <div className="criteria-item">
                    <span className={`criteria-icon ${passwordCriteria.hasNumber ? 'met' : ''}`}></span>
                    <span className="criteria-text">{t.criteria.number}</span>
                  </div>
                  <div className="criteria-item">
                    <span className={`criteria-icon ${passwordCriteria.hasSpecialChar ? 'met' : ''}`}></span>
                    <span className="criteria-text">{t.criteria.specialChar}</span>
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>{t.confirmPassword}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.confirmPasswordPlaceholder}
                  required
                />
              </div>
            )}

            <button 
              type="submit" 
              className="modal-submit-btn"
              style={{ 
                backgroundColor: providerColor,
                opacity: (!isLogin && !Object.values(passwordCriteria).every(c => c)) ? 0.6 : 1,
                cursor: (!isLogin && !Object.values(passwordCriteria).every(c => c)) ? 'not-allowed' : 'pointer'
              }}
              disabled={!isLogin && !Object.values(passwordCriteria).every(c => c)}
            >
              {isLogin ? t.login : t.signUp}
            </button>
          </form>

          <p className="modal-switch">
            {isLogin ? t.noAccount : t.haveAccount}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? t.signUp : t.login}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}