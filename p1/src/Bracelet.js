import React, { useState, useEffect } from "react";

function Bracelet({ lang, navigateTo, userType = "patient" }) {
  const isFamily = userType === "family";
  const isPatient = userType === "patient";
  
  const [braceletStatus, setBraceletStatus] = useState({
    connected: true,
    battery: 78,
    skinContact: true,
    lastUpdate: new Date(),
    firmware: "v2.1.0",
    signalStrength: 85
  });
  
  const [safeZone, setSafeZone] = useState({
    enabled: true,
    name: "Future University in Egypt",
    latitude: 30.02645,
    longitude: 31.49291,
    radius: 500
  });
  
  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, type: "info", message: "Bracelet connected successfully", time: "10:30 AM", resolved: true },
    { id: 2, type: "warning", message: "Low battery (15%)", time: "8:15 AM", resolved: false }
  ]);
  
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: "Enjy Abdelgaber", phone: "+201000000000", relation: "Family" },
    { id: 2, name: "Shimaa Kamal", phone: "+201000000002", relation: "Patient" }
  ]);
  
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" });
  
  // Simulate battery drain
  useEffect(() => {
    const batteryInterval = setInterval(() => {
      setBraceletStatus(prev => ({
        ...prev,
        battery: Math.max(5, prev.battery - 0.3)
      }));
    }, 60000);
    return () => clearInterval(batteryInterval);
  }, []);
  
  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setEmergencyContacts([...emergencyContacts, { ...newContact, id: Date.now() }]);
      setNewContact({ name: "", phone: "", relation: "" });
      setShowAddContact(false);
      // Add alert
      setRecentAlerts([{
        id: Date.now(),
        type: "info",
        message: `New emergency contact added: ${newContact.name}`,
        time: new Date().toLocaleTimeString(),
        resolved: true
      }, ...recentAlerts]);
    }
  };
  
  const handleRemoveContact = (id) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
  };
  
  const handleSendSOS = () => {
    setRecentAlerts([{
      id: Date.now(),
      type: "emergency",
      message: "SOS alert sent to all emergency contacts",
      time: new Date().toLocaleTimeString(),
      resolved: false
    }, ...recentAlerts]);
    alert(lang === "en" ? "🚨 SOS alert sent to family members!" : "🚨 تم إرسال إنذار SOS لأفراد العائلة!");
  };
  
  const handleActivateBuzzer = () => {
    setRecentAlerts([{
      id: Date.now(),
      type: "info",
      message: "Buzzer activated manually",
      time: new Date().toLocaleTimeString(),
      resolved: true
    }, ...recentAlerts]);
    alert(lang === "en" ? "🔔 Buzzer activated on bracelet" : "🔔 تم تشغيل الجرس على السوار");
  };
  
  const handleForceLocation = () => {
    setRecentAlerts([{
      id: Date.now(),
      type: "info",
      message: "Manual location update requested",
      time: new Date().toLocaleTimeString(),
      resolved: true
    }, ...recentAlerts]);
    alert(lang === "en" ? "📍 Location update requested" : "📍 تم طلب تحديث الموقع");
  };
  
  const handleUpdateSafeZone = () => {
    alert(lang === "en" 
      ? `Safe zone updated to ${safeZone.name} with radius ${safeZone.radius}m` 
      : `تم تحديث المنطقة الآمنة إلى ${safeZone.name} بنصف قطر ${safeZone.radius}م`);
  };
  
  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} style={{ maxWidth: "1400px", margin: "0 auto", padding: "1rem" }}>
      {/* Navigation Bar */}
      <nav style={{
        background: "white",
        borderRadius: "28px",
        padding: "0.6rem 1.5rem",
        marginBottom: "2rem",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <span 
          onClick={() => navigateTo("home")}
          style={{
            fontSize: "1.9rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #2c7da0, #5f4b8b)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            cursor: "pointer"
          }}
        >
          ZEKRA
        </span>
        <button
          onClick={() => navigateTo("home")}
          style={{
            background: "linear-gradient(95deg, #6BABE0, #9B8FD9)",
            border: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "40px",
            fontWeight: 600,
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer"
          }}
        >
          <i className="bi bi-arrow-left-circle"></i>
          {lang === "en" ? "Back to Home" : "العودة للرئيسية"}
        </button>
      </nav>
      
      {/* User Type Indicator */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <span style={{
          background: isFamily ? "#9B8FD9" : "#6BABE0",
          color: "white",
          padding: "0.3rem 1rem",
          borderRadius: "20px",
          fontSize: "0.8rem"
        }}>
          {isFamily 
            ? (lang === "en" ? "👨‍👩‍👧 Family View - Full Control" : "👨‍👩‍👧 عرض العائلة - تحكم كامل")
            : (lang === "en" ? "👤 Patient View - Basic Info" : "👤 عرض المريض - معلومات أساسية")
          }
        </span>
      </div>
      
      {/* Page Title */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ color: "#1f3b4c", fontWeight: 700 }}>
          <i className="bi bi-watch"></i> {lang === "en" ? "Smart Bracelet" : "السوار الذكي"}
        </h1>
        <p style={{ color: "#5e7e97" }}>
          {isFamily 
            ? (lang === "en" ? "Monitor and control the patient's bracelet" : "مراقبة والتحكم في سوار المريض")
            : (lang === "en" ? "Your health and safety companion" : "رفيق صحتك وسلامتك")
          }
        </p>
      </div>
      
      {/* Main Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isFamily ? "repeat(auto-fit, minmax(350px, 1fr))" : "1fr",
        gap: "1.5rem"
      }}>
        
        {/* Bracelet Status Card - Shows for both */}
        <div style={{
          background: "white",
          borderRadius: "28px",
          padding: "1.5rem",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1f3b4c" }}>
            <i className="bi bi-info-circle"></i> {lang === "en" ? "Bracelet Status" : "حالة السوار"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
              <span><i className="bi bi-bluetooth"></i> {lang === "en" ? "Connection:" : "الاتصال:"}</span>
              <span style={{ color: braceletStatus.connected ? "#2e7d32" : "#d32f2f", fontWeight: 600 }}>
                {braceletStatus.connected ? (lang === "en" ? "Connected ✓" : "متصل ✓") : (lang === "en" ? "Disconnected" : "غير متصل")}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
              <span><i className="bi bi-battery-full"></i> {lang === "en" ? "Battery:" : "البطارية:"}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "80px", background: "#e2e8f0", height: "8px", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ width: `${braceletStatus.battery}%`, height: "100%", background: braceletStatus.battery > 20 ? "#2e7d32" : "#e63946", borderRadius: "12px" }}></div>
                </div>
                <span>{Math.round(braceletStatus.battery)}%</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
              <span><i className="bi bi-hand-index"></i> {lang === "en" ? "Skin Contact:" : "ملامسة الجلد:"}</span>
              <span style={{ color: braceletStatus.skinContact ? "#2e7d32" : "#d32f2f", fontWeight: 600 }}>
                {braceletStatus.skinContact ? (lang === "en" ? "Detected ✓" : "ملامس ✓") : (lang === "en" ? "Not Detected" : "غير ملامس")}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
              <span><i className="bi bi-signal"></i> {lang === "en" ? "Signal Strength:" : "قوة الإشارة:"}</span>
              <span>{braceletStatus.signalStrength}%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0" }}>
              <span><i className="bi bi-clock"></i> {lang === "en" ? "Last Update:" : "آخر تحديث:"}</span>
              <span>{braceletStatus.lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        
        {/* For Family Users - Additional Cards */}
        {isFamily && (
          <>
            {/* Safe Zone Settings */}
            <div style={{
              background: "white",
              borderRadius: "28px",
              padding: "1.5rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1f3b4c" }}>
                <i className="bi bi-shield-check"></i> {lang === "en" ? "Safe Zone Settings" : "إعدادات المنطقة الآمنة"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: "0.3rem" }}>
                    {lang === "en" ? "Location:" : "الموقع:"}
                  </label>
                  <input 
                    type="text" 
                    value={safeZone.name}
                    onChange={(e) => setSafeZone({...safeZone, name: e.target.value})}
                    style={{ width: "100%", padding: "0.6rem", borderRadius: "12px", border: "1px solid #ddd" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: "0.3rem" }}>
                    {lang === "en" ? "Radius (meters):" : "نصف القطر (متر):"}
                  </label>
                  <input 
                    type="number" 
                    value={safeZone.radius}
                    onChange={(e) => setSafeZone({...safeZone, radius: parseInt(e.target.value)})}
                    style={{ width: "100%", padding: "0.6rem", borderRadius: "12px", border: "1px solid #ddd" }}
                  />
                </div>
                <button onClick={handleUpdateSafeZone} style={{
                  background: "linear-gradient(95deg, #6BABE0, #9B8FD9)",
                  border: "none",
                  padding: "0.6rem",
                  borderRadius: "12px",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: "0.5rem"
                }}>
                  {lang === "en" ? "Update Safe Zone" : "تحديث المنطقة الآمنة"}
                </button>
              </div>
            </div>
            
            {/* Emergency Contacts */}
            <div style={{
              background: "white",
              borderRadius: "28px",
              padding: "1.5rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1f3b4c" }}>
                <i className="bi bi-telephone"></i> {lang === "en" ? "Emergency Contacts" : "جهات الاتصال للطوارئ"}
              </h2>
              {emergencyContacts.map(contact => (
                <div key={contact.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #eee"
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{contact.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>{contact.phone} - {contact.relation}</div>
                  </div>
                  <button onClick={() => handleRemoveContact(contact.id)} style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    padding: "0.3rem 0.8rem",
                    cursor: "pointer",
                    fontSize: "0.7rem"
                  }}>
                    {lang === "en" ? "Remove" : "حذف"}
                  </button>
                </div>
              ))}
              
              {showAddContact ? (
                <div style={{ marginTop: "1rem", padding: "1rem", background: "#f8f9fa", borderRadius: "16px" }}>
                  <input 
                    type="text"
                    placeholder={lang === "en" ? "Name" : "الاسم"}
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: "8px", border: "1px solid #ddd" }}
                  />
                  <input 
                    type="tel"
                    placeholder={lang === "en" ? "Phone" : "الهاتف"}
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: "8px", border: "1px solid #ddd" }}
                  />
                  <input 
                    type="text"
                    placeholder={lang === "en" ? "Relation" : "العلاقة"}
                    value={newContact.relation}
                    onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                    style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: "8px", border: "1px solid #ddd" }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={handleAddContact} style={{ flex: 1, background: "#28a745", color: "white", border: "none", padding: "0.5rem", borderRadius: "8px", cursor: "pointer" }}>
                      {lang === "en" ? "Save" : "حفظ"}
                    </button>
                    <button onClick={() => setShowAddContact(false)} style={{ flex: 1, background: "#6c757d", color: "white", border: "none", padding: "0.5rem", borderRadius: "8px", cursor: "pointer" }}>
                      {lang === "en" ? "Cancel" : "إلغاء"}
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowAddContact(true)} style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "0.6rem",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: 600
                }}>
                  <i className="bi bi-plus-circle"></i> {lang === "en" ? "Add Contact" : "إضافة جهة اتصال"}
                </button>
              )}
            </div>
            
            {/* Manual Controls */}
            <div style={{
              background: "white",
              borderRadius: "28px",
              padding: "1.5rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1f3b4c" }}>
                <i className="bi bi-controller"></i> {lang === "en" ? "Manual Controls" : "التحكم اليدوي"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <button onClick={handleSendSOS} style={{
                  background: "linear-gradient(135deg, #dc3545, #ff6b6b)",
                  border: "none",
                  padding: "0.8rem",
                  borderRadius: "12px",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}>
                  <i className="bi bi-sos"></i> {lang === "en" ? "Send SOS Alert" : "إرسال إنذار SOS"}
                </button>
                <button onClick={handleActivateBuzzer} style={{
                  background: "#ffc107",
                  border: "none",
                  padding: "0.8rem",
                  borderRadius: "12px",
                  color: "#333",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}>
                  <i className="bi bi-bell"></i> {lang === "en" ? "Activate Buzzer" : "تشغيل الجرس"}
                </button>
                <button onClick={handleForceLocation} style={{
                  background: "#17a2b8",
                  border: "none",
                  padding: "0.8rem",
                  borderRadius: "12px",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}>
                  <i className="bi bi-geo-alt"></i> {lang === "en" ? "Force Location Update" : "تحديث الموقع القسري"}
                </button>
              </div>
            </div>
            
            {/* Recent Alerts */}
            <div style={{
              background: "white",
              borderRadius: "28px",
              padding: "1.5rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1f3b4c" }}>
                <i className="bi bi-bell"></i> {lang === "en" ? "Recent Alerts" : "الإنذارات الأخيرة"}
              </h2>
              {recentAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} style={{
                  padding: "0.6rem",
                  borderBottom: "1px solid #eee",
                  backgroundColor: alert.type === "emergency" ? "#fff3f0" : alert.type === "warning" ? "#fff9e6" : "#f8f9fa",
                  borderRadius: "8px",
                  marginBottom: "0.5rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 500 }}>{alert.message}</span>
                    <span style={{ fontSize: "0.7rem", color: "#666" }}>{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* For Patient Users - Simplified View */}
        {isPatient && (
          <>
            {/* Health Tips */}
            <div style={{
              background: "linear-gradient(135deg, #e8f4f8, #f0e8ff)",
              borderRadius: "28px",
              padding: "1.5rem",
              textAlign: "center"
            }}>
              <i className="bi bi-heart-fill" style={{ fontSize: "2rem", color: "#e63946" }}></i>
              <h3 style={{ marginTop: "0.5rem", color: "#1f3b4c" }}>
                {lang === "en" ? "Stay Healthy!" : "كن بصحة جيدة!"}
              </h3>
              <p style={{ color: "#5e7e97" }}>
                {lang === "en" 
                  ? "Your bracelet is monitoring your activity and safety 24/7" 
                  : "سوارك يراقب نشاطك وسلامتك على مدار الساعة"}
              </p>
            </div>
            
            {/* SOS Button for Patient */}
            <button onClick={handleSendSOS} style={{
              background: "linear-gradient(135deg, #dc3545, #ff6b6b)",
              border: "none",
              borderRadius: "50px",
              padding: "1.2rem",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.8rem",
              boxShadow: "0 8px 25px rgba(220,53,69,0.4)"
            }}>
              <i className="bi bi-sos"></i>
              {lang === "en" ? "SOS - Call for Help" : "SOS - طلب مساعدة"}
            </button>
          </>
        )}
      </div>
      
      <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.75rem", color: "#5e7e97" }}>
        <i className="bi bi-shield-lock"></i> {lang === "en" ? "Secure bracelet connection • Powered by Zekra" : "اتصال آمن بالسوار • يعمل بنظام ذكرى"}
      </div>
    </div>
  );
}

export default Bracelet;