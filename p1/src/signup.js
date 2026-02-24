import React, { useState, useEffect } from "react";

export default function Signup({ switchMode, onSignupSuccess, onSocialLogin, lang }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUpperAndLower: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const password = form.password;
    
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
  }, [form.password]);

  const handleSubmit = e => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      alert(lang === "en" ? "Passwords do not match!" : "كلمات المرور غير متطابقة!");
      return;
    }

    if (!form.fullName || !form.email || !form.password) {
      alert(lang === "en" ? "Please fill all fields" : "الرجاء ملء جميع الحقول");
      return;
    }

    if (!Object.values(passwordCriteria).every(criteria => criteria)) {
      alert(lang === "en" ? "Password does not meet all security requirements!" : "كلمة المرور لا تستوفي جميع متطلبات الأمان!");
      return;
    }

    const userData = {
      fullName: form.fullName,
      email: form.email,
      password: form.password
    };

    onSignupSuccess(userData);
  };

  const translations = {
    en: {
      title: "Join ",
      subtitle: "Create your account",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      email: "Email Address",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      createAccount: "Create Account",
      haveAccount: "Already have an account?",
      signIn: "Sign In",
      orContinue: "Or continue with",
      criteria: {
        minLength: "At least 8 characters",
        upperLower: "Uppercase and lowercase letters",
        number: "At least one number",
        specialChar: "At least one special character (@$*#&)"
      }
    },
    ar: {
      title: " انضم  ",
      subtitle: "إنشاء حساب جديد",
      fullName: "الاسم الكامل",
      fullNamePlaceholder: "أدخل اسمك الكامل",
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      password: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      confirmPasswordPlaceholder: "أكد كلمة المرور",
      createAccount: "إنشاء حساب",
      haveAccount: "لديك حساب بالفعل؟",
      signIn: "تسجيل الدخول",
      orContinue: "أو المتابعة باستخدام",
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
    <div>
      <h2>{t.title}</h2>
      <p className="subtitle">{t.subtitle}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t.fullName}</label>
          <input
            type="text"
            name="fullName"
            placeholder={t.fullNamePlaceholder}
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

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
        </div>

        <div className="form-group">
          <label>{t.confirmPassword}</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder={t.confirmPasswordPlaceholder}
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button 
          type="submit"
          disabled={!Object.values(passwordCriteria).every(c => c) || !form.password}
        >
          <span style={{ color: 'white' }}>{t.createAccount}</span>
        </button>

        <p className="switch-text">
          {t.haveAccount}
          <span className="link" onClick={switchMode}> {t.signIn}</span>
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