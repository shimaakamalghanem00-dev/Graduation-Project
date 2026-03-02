import React, { useState, useEffect } from "react";

export default function Signup({ switchMode, onSignupSuccess, onSocialLogin, lang }) {
  const [accountType, setAccountType] = useState(null); // null, 'family', 'patient'
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthDate: "",
    phone: ""
  });
  const [familyEmails, setFamilyEmails] = useState([""]); // مصفوفة للإيميلات (حتى 3)

  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUpperAndLower: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFamilyEmailChange = (index, value) => {
    const newEmails = [...familyEmails];
    newEmails[index] = value;
    setFamilyEmails(newEmails);
  };

  const addFamilyEmailField = () => {
    if (familyEmails.length < 3) {
      setFamilyEmails([...familyEmails, ""]);
    }
  };

  const removeFamilyEmailField = (index) => {
    if (familyEmails.length > 1) {
      const newEmails = familyEmails.filter((_, i) => i !== index);
      setFamilyEmails(newEmails);
    }
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

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      alert(lang === "en" ? "Passwords do not match!" : "كلمات المرور غير متطابقة!");
      return;
    }

    if (!form.fullName || !form.email || !form.password || !form.gender || !form.birthDate || !form.phone) {
      alert(lang === "en" ? "Please fill all required fields" : "الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    if (!Object.values(passwordCriteria).every(criteria => criteria)) {
      alert(lang === "en" ? "Password does not meet all security requirements!" : "كلمة المرور لا تستوفي جميع متطلبات الأمان!");
      return;
    }

    // التحقق من إيميلات العائلة إذا كان النوع مريض
    if (accountType === "patient") {
      const validEmails = familyEmails.filter(email => email.trim() !== "");
      if (validEmails.length === 0) {
        alert(lang === "en" ? "Please enter at least one family email" : "الرجاء إدخال بريد إلكتروني واحد للعائلة على الأقل");
        return;
      }
      // يمكن إضافة تحقق من صحة الإيميلات هنا
    }

    const age = calculateAge(form.birthDate);

    const userData = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      gender: form.gender,
      birthDate: form.birthDate,
      phone: form.phone,
      age: age,
      profilePhoto: null,
      createdAt: new Date().toISOString(),
      accountType: accountType, // 'family' or 'patient'
      ...(accountType === "patient" && { familyEmails: familyEmails.filter(e => e.trim() !== "") }) // فقط إذا كان مريض
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
      gender: "Gender",
      genderPlaceholder: "Select your gender",
      male: "Male",
      female: "Female",
      birthDate: "Date of Birth",
      birthDatePlaceholder: "mm / dd / yyyy",
      phone: "Phone Number",
      phonePlaceholder: "Enter your phone number",
      createAccount: "Create Account",
      haveAccount: "Already have an account?",
      signIn: "Sign In",
      orContinue: "Or continue with",
      criteria: {
        minLength: "At least 8 characters",
        upperLower: "Uppercase and lowercase letters",
        number: "At least one number",
        specialChar: "At least one special character (@$*#&)"
      },
      chooseAccountType: "Choose Account Type",
      familyAccount: "Family Account",
      patientAccount: "Patient Account",
      familyDesc: "Create an account to manage reminders and monitor patient",
      patientDesc: "Create an account for the patient with family supervision",
      familyEmail: "Family Email",
      familyEmailPlaceholder: "Enter family member's email",
      addAnotherEmail: "+ Add another email",
      maxThreeEmails: "You can add up to 3 family emails",
      remove: "Remove"
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
      gender: "الجنس",
      genderPlaceholder: "اختر الجنس",
      male: "ذكر",
      female: "أنثى",
      birthDate: "تاريخ الميلاد",
      birthDatePlaceholder: "yyyy / mm / dd",
      phone: "رقم الهاتف",
      phonePlaceholder: "أدخل رقم هاتفك",
      createAccount: "إنشاء حساب",
      haveAccount: "لديك حساب بالفعل؟",
      signIn: "تسجيل الدخول",
      orContinue: "أو المتابعة باستخدام",
      criteria: {
        minLength: "8 أحرف على الأقل",
        upperLower: "أحرف كبيرة وصغيرة",
        number: "رقم واحد على الأقل",
        specialChar: "رمز خاص واحد على الأقل (@$*#&)"
      },
      chooseAccountType: "اختر نوع الحساب",
      familyAccount: "حساب عائلة",
      patientAccount: "حساب مريض",
      familyDesc: "أنشئ حساباً لإدارة التذكيرات ومتابعة المريض",
      patientDesc: "أنشئ حساباً للمريض مع إشراف العائلة",
      familyEmail: "البريد الإلكتروني للعائلة",
      familyEmailPlaceholder: "أدخل بريد فرد العائلة",
      addAnotherEmail: "+ إضافة بريد آخر",
      maxThreeEmails: "يمكنك إضافة حتى 3 بريدات للعائلة",
      remove: "إزالة"
    }
  };

  const t = translations[lang];

  // عرض بطاقات الاختيار إذا لم يتم اختيار نوع الحساب بعد
  if (accountType === null) {
    return (
      <div>
        <h2>{t.title}</h2>
        <p className="subtitle">{t.chooseAccountType}</p>
        <div className="row g-4 mt-3">
          <div className="col-md-6">
            <div className="card h-100 text-center p-4" style={{ cursor: 'pointer' }} onClick={() => setAccountType('family')}>
              <i className="bi bi-people-fill" style={{ fontSize: '3rem', color: '#9B8FD9' }}></i>
              <h5 className="mt-3">{t.familyAccount}</h5>
              <p className="text-muted">{t.familyDesc}</p>
              <button className="btn btn-outline-primary mt-2">{lang === 'en' ? 'Select' : 'اختيار'}</button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 text-center p-4" style={{ cursor: 'pointer' }} onClick={() => setAccountType('patient')}>
              <i className="bi bi-person-heart" style={{ fontSize: '3rem', color: '#6BABE0' }}></i>
              <h5 className="mt-3">{t.patientAccount}</h5>
              <p className="text-muted">{t.patientDesc}</p>
              <button className="btn btn-outline-primary mt-2">{lang === 'en' ? 'Select' : 'اختيار'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // عرض فورم التسجيل بعد اختيار النوع
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{t.title}</h2>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setAccountType(null)}>
          <i className="bi bi-arrow-left"></i> {lang === 'en' ? 'Back' : 'رجوع'}
        </button>
      </div>
      <p className="subtitle">
        {accountType === 'family' ? t.familyAccount : t.patientAccount} - {t.subtitle}
      </p>

      <form onSubmit={handleSubmit}>
        {/* الحقول المشتركة */}
        <div className="form-group">
          <label>{t.fullName} </label>
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
          <label>{t.email} </label>
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
          <label>{t.phone} </label>
          <input
            type="tel"
            name="phone"
            placeholder={t.phonePlaceholder}
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t.gender} </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            style={{
              color: form.gender ? '#4A7B9D' : '#A0C4E8'
            }}
          >
            <option value="" disabled>{t.genderPlaceholder}</option>
            <option value="male">{t.male}</option>
            <option value="female">{t.female}</option>
          </select>
        </div>

        <div className="form-group">
          <label>{t.birthDate} </label>
          <input
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]}
            style={{
              color: form.birthDate ? '#4A7B9D' : '#A0C4E8'
            }}
          />
        </div>

        {/* حقول إضافية لحساب المريض: إيميلات العائلة */}
        {accountType === 'patient' && (
          <div className="form-group">
            <label>{t.familyEmail} <small className="text-muted">({t.maxThreeEmails})</small></label>
            {familyEmails.map((email, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder={t.familyEmailPlaceholder}
                  value={email}
                  onChange={(e) => handleFamilyEmailChange(index, e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                {familyEmails.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFamilyEmailField(index)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            ))}
            {familyEmails.length < 3 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary mt-1"
                onClick={addFamilyEmailField}
              >
                <i className="bi bi-plus-circle"></i> {t.addAnotherEmail}
              </button>
            )}
          </div>
        )}

        {/* حقول كلمة المرور */}
        <div className="form-group">
          <label>{t.password} </label>
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
          <label>{t.confirmPassword} </label>
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