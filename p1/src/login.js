import React, { useState } from "react";

export default function Login({ switchMode, onLoginSuccess, onSocialLogin, onForgotPassword, lang }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      alert(lang === "en" ? "Please fill all fields" : "الرجاء ملء جميع الحقول");
      return;
    }

    onLoginSuccess(form.email, form.password);
  };

  const translations = {
    en: {
      welcome: "Welcome ",
      back: "Back",
      subtitle: "Sign in to your account",
      email: "Email Address",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      signIn: "Sign In",
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
      orContinue: "Or continue with"
    },
    ar: {
      back: " مرحباً ",
      welcome: " بعودتك ",
      subtitle: "سجل الدخول إلى حسابك",
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      password: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      rememberMe: "تذكرني",
      forgotPassword: "نسيت كلمة المرور؟",
      signIn: "تسجيل الدخول",
      noAccount: "ليس لديك حساب؟",
      signUp: "إنشاء حساب",
      orContinue: "أو المتابعة باستخدام"
    }
  };

  const t = translations[lang];

  return (
    <div>
      <h2>{t.welcome}<span className="gradient-text">{t.back}</span></h2>
      <p className="subtitle">{t.subtitle}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t.email}</label>
          <input
            type="email"
            name="email"
            placeholder={t.emailPlaceholder}
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t.password}</label>
          <input
            type="password"
            name="password"
            placeholder={t.passwordPlaceholder}
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="login-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            {t.rememberMe}
          </label>
          <span 
            className="forgot-password" 
            style={{ cursor: 'pointer' }} 
            onClick={onForgotPassword}
          >
            {t.forgotPassword}
          </span>
        </div>

        <button type="submit">
          <span style={{ color: 'white' }}>{t.signIn}</span>
        </button>

        <p className="switch-text">
          {t.noAccount}
          <span className="link" onClick={switchMode}> {t.signUp}</span>
        </p>

        <div className="divider">
          <span>{t.orContinue}</span>
        </div>

        <div className="social-buttons">
          <button 
            type="button" 
            className="social-btn google"
            onClick={() => onSocialLogin("google")}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Google
          </button>
          <button 
            type="button" 
            className="social-btn facebook"
            onClick={() => onSocialLogin("facebook")}
          >
            <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
            Facebook
          </button>
        </div>
      </form>
    </div>
  );
}