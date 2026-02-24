import React, { useState } from "react";

export default function ForgotPassword({ onBack, onSubmit, lang }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); 

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    if (!email) {
      alert(lang === "en" ? "Please enter your email" : "الرجاء إدخال بريدك الإلكتروني");
      return;
    }
    
    onSubmit(email);
    setStep(2);
  };

  const handleSubmitCode = (e) => {
    e.preventDefault();
    if (!code) {
      alert(lang === "en" ? "Please enter the code" : "الرجاء إدخال الكود");
      return;
    }
  
    alert(lang === "en" 
      ? "Password reset successfully! Check your email for new password." 
      : "تم إعادة تعيين كلمة المرور بنجاح! تحقق من بريدك الإلكتروني للحصول على كلمة المرور الجديدة.");
    onBack();
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2 className="gradient-text">
          {lang === "en" ? "Forgot Password" : "نسيت كلمة المرور"}
        </h2>
        
        {step === 1 ? (
          <>
            <p className="subtitle">
              {lang === "en" 
                ? "Enter your email to receive a reset code" 
                : "أدخل بريدك الإلكتروني لاستلام رمز إعادة التعيين"}
            </p>

            <form onSubmit={handleSubmitEmail}>
              <div className="form-group">
                <label>{lang === "en" ? "Email Address" : "البريد الإلكتروني"}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === "en" ? "Enter your email" : "أدخل بريدك الإلكتروني"}
                  required
                />
              </div>

              <button type="submit">
                {lang === "en" ? "Send Reset Code" : "إرسال رمز إعادة التعيين"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="subtitle">
              {lang === "en" 
                ? "Enter the code sent to your email" 
                : "أدخل الرمز المرسل إلى بريدك الإلكتروني"}
            </p>

            <form onSubmit={handleSubmitCode}>
              <div className="form-group">
                <label>{lang === "en" ? "Reset Code" : "رمز إعادة التعيين"}</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={lang === "en" ? "Enter 6-digit code" : "أدخل الرمز المكون من 6 أرقام"}
                  maxLength="6"
                  required
                />
              </div>

              <button type="submit">
                {lang === "en" ? "Verify Code" : "تحقق من الرمز"}
              </button>
            </form>
          </>
        )}

        <div className="auth-footer">
          <button 
            className="link" 
            onClick={onBack}
            style={{ background: 'none', border: 'none', margin: 0 }}
          >
            {lang === "en" ? "← Back to Login" : "← العودة لتسجيل الدخول"}
          </button>
        </div>
      </div>
    </div>
  );
}