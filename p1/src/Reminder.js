import React, { useState, useEffect, useRef } from "react";
import './Reminder.css';

export default function Reminder({ lang, navigateTo }) {
  const [reminders, setReminders] = useState([]); 
  const [showPatientAddCard, setShowPatientAddCard] = useState(false);
  const [showFamilyAddCard, setShowFamilyAddCard] = useState(false);
  const [view, setView] = useState("patient"); 
  const [filter, setFilter] = useState("all"); 
  const [notifications, setNotifications] = useState([]);

  const handleOpenPatientCard = () => {
    setShowPatientAddCard(true);
    setShowFamilyAddCard(false);
  };

  const handleOpenFamilyCard = () => {
    setShowFamilyAddCard(true);
    setShowPatientAddCard(false);
  };

  const handleCloseAllCards = () => {
    setShowPatientAddCard(false);
    setShowFamilyAddCard(false);
  };

  // Check REMINDER & TIME
  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      reminders.forEach(reminder => {
        if (reminder.status === "pending" && reminder.time === currentTime) {
          if (Notification.permission === "granted") {
            new Notification(reminder.title, {
              body: reminder.voiceMessage,
              icon: "/favicon.ico"
            });
          }
          
          setNotifications(prev => [
            ...prev,
            {
              id: reminder.id,
              message: reminder.voiceMessage,
              time: new Date().toLocaleTimeString()
            }
          ]);

          alert(`🔔 ${reminder.title}\n${reminder.voiceMessage}`);
        }
      });
    }, 30000); 

    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    return () => clearInterval(checkReminders);
  }, [reminders]);

  // Check ignored
  useEffect(() => {
    const checkIgnoredReminders = setInterval(() => {
      const now = new Date();
      const currentTime = now.getTime();
      
      setReminders(prevReminders => 
        prevReminders.map(reminder => {
          if (reminder.status === "pending") {
            const [hours, minutes] = reminder.time.split(':');
            const reminderTime = new Date();
            reminderTime.setHours(parseInt(hours), parseInt(minutes), 0);
            
            if (currentTime - reminderTime.getTime() > 30 * 60 * 1000) {
              console.log(`Reminder ${reminder.id} is now ignored (30 min passed)`);
              return {
                ...reminder,
                status: "ignored",
                response: "ignored"
              };
            }
          }
          return reminder;
        })
      );
    }, 60000); 

    return () => clearInterval(checkIgnoredReminders);
  }, []); 

  const translations = {
    en: {
      title: "Reminders",
      subtitle: "Daily tasks and medications",
      back: "Back to Home",
      patientView: "Patient View",
      familyView: "Family Dashboard",
      todayReminders: "Today's Reminders",
      previousReminders: "Previous Reminders",
      myReminders: "My Reminders",
      familyReminders: "Family Reminders",
      allReminders: "All Reminders",
      completed: "Completed",
      pending: "Pending",
      ignored: "Ignored",
      adherence: "Adherence Rate",
      voiceReminder: "Voice Reminder",
      markCompleted: " Done",
      markLater: " Later",
      delete: "Delete",
      noReminders: "No reminders found",
      filter: "Filter",
      addReminder: "Add Reminder",
      addPatientReminder: "Add My Own Reminder",
      addFamilyReminder: "Add Reminder for Patient",
      reminderTypes: {
        medication: "💊 Medication",
        hydration: "💧 Water",
        appointment: "📅 Appointment",
        task: "✅ Task"
      },
      form: {
        title: "Reminder Title",
        time: "Time",
        type: "Type",
        repeat: "Repeat",
        voiceMessage: "Voice Message",
        save: "Save Reminder",
        cancel: "Cancel",
        quickAdd: "Quick Add",
        whatToRemember: "🔔 WHAT DO YOU WANT TO REMEMBER?",
        example: "e.g., Take medicine, Call family, Walk",
        once: "Once",
        daily: "Daily",
        weekly: "Weekly",
        optional: "Optional",
        am: "AM",
        pm: "PM"
      },
      stats: {
        total: "Total",
        completed: "Done",
        rate: "Rate"
      },
      alerts: {
        noResponse: " No response for 30 minutes",
      },
      createdBy: {
        patient: "You",
        family: "Family"
      },
      time: {
        today: "Today",
        yesterday: "Yesterday",
        daysAgo: "days ago"
      },
      recording: {
        clickToRecord: "Click to Record",
        recording: "🔴 Recording... Speak now",
        playing: " Playing...",
        record: "Record Voice",
        stop: " Stop",
        play: " Play",
        delete: "🗑 Delete"
      }
    },
    ar: {
      title: "التذكيرات",
      subtitle: "المهام اليومية والأدوية",
      back: "العودة للرئيسية",
      patientView: "عرض المريض",
      familyView: "لوحة تحكم العائلة",
      todayReminders: "تذكيرات اليوم",
      previousReminders: "التذكيرات السابقة",
      myReminders: "تذكيراتي",
      familyReminders: "تذكيرات العائلة",
      allReminders: "جميع التذكيرات",
      completed: "مكتمل",
      pending: "قيد الانتظار",
      ignored: "متجاهل",
      adherence: "نسبة الالتزام",
      voiceReminder: "تذكير صوتي",
      markCompleted: " تم",
      markLater: " لاحقاً",
      delete: "حذف",
      noReminders: "لا توجد تذكيرات",
      filter: "تصفية",
      addReminder: "إضافة تذكير",
      addPatientReminder: "إضافة تذكير خاص بي",
      addFamilyReminder: "إضافة تذكير للمريض",
      reminderTypes: {
        medication: "💊 دواء",
        hydration: "💧 ماء",
        appointment: "📅 موعد",
        task: "✅ مهمة"
      },
      form: {
        title: "عنوان التذكير",
        time: "الوقت",
        type: "النوع",
        repeat: "التكرار",
        voiceMessage: "الرسالة الصوتية",
        save: "حفظ",
        cancel: "إلغاء",
        quickAdd: "إضافة سريعة",
        whatToRemember: "🔔 ماذا تريد أن تتذكر؟",
        example: "مثال: تناول دواء، الاتصال بالعائلة، المشي",
        once: "مرة",
        daily: "يومي",
        weekly: "أسبوعي",
        optional: "اختياري",
        am: "ص",
        pm: "م"
      },
      stats: {
        total: "الإجمالي",
        completed: "المكتملة",
        rate: "النسبة"
      },
      alerts: {
        noResponse: " لا استجابة لمدة 30 دقيقة",
      },
      createdBy: {
        patient: "أنت",
        family: "العائلة"
      },
      time: {
        today: "اليوم",
        yesterday: "أمس",
        daysAgo: "أيام مضت"
      },
      recording: {
        clickToRecord: " اضغط للتسجيل",
        recording: "🔴 جاري التسجيل... تحدث الآن",
        playing: " جاري التشغيل...",
        record: "سجل صوت",
        stop: " إيقاف",
        play: " تشغيل",
        delete: "🗑 حذف"
      }
    }
  };

  const t = translations[lang];

  const today = new Date().toISOString().split('T')[0];
  const todayReminders = reminders.filter(r => r.date === today);
  const previousReminders = reminders.filter(r => r.date !== today);

  const getFilteredReminders = (reminderList) => {
    if (filter === "all") return reminderList;
    return reminderList.filter(r => r.status === filter);
  };

  // Calculate 
  const stats = {
    total: reminders.length,
    completed: reminders.filter(r => r.status === "completed").length,
    pending: reminders.filter(r => r.status === "pending").length,
    ignored: reminders.filter(r => r.status === "ignored").length,
    patientReminders: reminders.filter(r => r.createdBy === "patient").length,
    familyReminders: reminders.filter(r => r.createdBy === "family").length,
    adherenceRate: reminders.length > 0 
      ? Math.round((reminders.filter(r => r.status === "completed").length / reminders.length) * 100)
      : 0,
    todayCompleted: reminders.filter(r => r.date === today && r.status === "completed").length,
    todayTotal: reminders.filter(r => r.date === today).length
  };

  // 24 to 12
  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleResponse = (id, response) => {
    if (response === "later") {
      const reminder = reminders.find(r => r.id === id);
      if (reminder) {
        const [hours, minutes] = reminder.time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes) + 30, 0);
        
        const newHours = date.getHours().toString().padStart(2, '0');
        const newMinutes = date.getMinutes().toString().padStart(2, '0');
        const newTime = `${newHours}:${newMinutes}`;
        
        setReminders(reminders.map(r => 
          r.id === id 
            ? { 
                ...r, 
                time: newTime,
                displayTime: convertTo12Hour(newTime),
                response: "later"
              }
            : r
        ));
        
        alert(lang === "en" 
          ? `⏰ Reminder moved to ${convertTo12Hour(newTime)}` 
          : `⏰ تم نقل التذكير إلى ${convertTo12Hour(newTime)}`);
      }
    } else if (response === "completed") {
      setReminders(reminders.map(r => 
        r.id === id 
          ? { 
              ...r, 
              status: "completed", 
              response: "completed",
              responseTime: new Date().toLocaleTimeString().slice(0,5)
            }
          : r
      ));
      alert(lang === "en" ? "✅ Good job! Task completed!" : "✅ أحسنت! تم إكمال المهمة!");
    }
  };

  const handleDeleteReminder = (id) => {
    if (window.confirm(lang === "en" ? "Delete this reminder?" : "حذف هذا التذكير؟")) {
      setReminders(reminders.filter(r => r.id !== id));
    }
  };

  const handleAddPatientReminder = (reminderData) => {
    if (reminderData.title && reminderData.time) {
      const reminder = {
        id: reminders.length + 1,
        title: reminderData.title,
        time: reminderData.time,
        displayTime: convertTo12Hour(reminderData.time),
        type: reminderData.type,
        repeat: reminderData.repeat,
        voiceMessage: reminderData.voiceMessage || 
          (lang === "en" 
            ? `Remember to ${reminderData.title}` 
            : `تذكر ${reminderData.title}`),
        status: "pending",
        response: null,
        active: true,
        createdBy: "patient",
        date: new Date().toISOString().split('T')[0],
        audioUrl: reminderData.audioBlob ? URL.createObjectURL(reminderData.audioBlob) : null
      };
      setReminders([...reminders, reminder]);
      setShowPatientAddCard(false); 
      
      alert(lang === "en" ? "✅ Reminder added successfully!" : "✅ تم إضافة التذكير بنجاح!");
    }
  };

  const handleAddFamilyReminder = (reminderData) => {
    if (reminderData.title && reminderData.time) {
      const reminder = {
        id: reminders.length + 1,
        ...reminderData,
        time: reminderData.time,
        displayTime: convertTo12Hour(reminderData.time),
        status: "pending",
        voiceMessage: reminderData.voiceMessage || 
          (lang === "en" 
            ? `Remember to ${reminderData.title}` 
            : `تذكر ${reminderData.title}`),
        response: null,
        createdBy: "family",
        date: new Date().toISOString().split('T')[0],
        audioUrl: reminderData.audioBlob ? URL.createObjectURL(reminderData.audioBlob) : null
      };
      setReminders([...reminders, reminder]);
      setShowFamilyAddCard(false); 
      
      alert(lang === "en" ? "✅ Reminder added successfully!" : "✅ تم إضافة التذكير بنجاح!");
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case "medication": return "💊";
      case "hydration": return "💧";
      case "appointment": return "📅";
      case "task": return "✅";
      default: return "⏰";
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "completed": return "#28a745";
      case "pending": return "#ffc107";
      case "ignored": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const getRelativeDate = (date) => {
    if (date === today) return t.time.today;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date === yesterday.toISOString().split('T')[0]) return t.time.yesterday;
    return date;
  };

  const ReminderCard = ({ reminder }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const playAudio = () => {
      if (reminder.audioUrl && audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    };

    return (
      <div className={`reminder-card ${reminder.status} ${reminder.createdBy === "patient" ? "patient-reminder" : ""}`}>
        {reminder.audioUrl && (
          <audio ref={audioRef} src={reminder.audioUrl} />
        )}
        <div className="reminder-header">
          <div className={`reminder-badge ${reminder.createdBy}`}>
            <i className={`bi bi-${reminder.createdBy === "patient" ? "person" : "people"}`}></i>
            <span>{reminder.createdBy === "patient" ? t.createdBy.patient : t.createdBy.family}</span>
          </div>
          <div className="reminder-header-actions">
            <span className="reminder-date">{getRelativeDate(reminder.date)}</span>
            <button 
              className="delete-reminder-btn"
              onClick={() => handleDeleteReminder(reminder.id)}
              title={t.delete}
            >
              <i className="bi bi-trash3-fill"></i>
            </button>
          </div>
        </div>
        
        <div className="reminder-time">
          <i className="bi bi-clock"></i>
          <span className="time">{reminder.displayTime || convertTo12Hour(reminder.time)}</span>
          {reminder.responseTime && (
            <span className="response-time">
              <i className="bi bi-check-circle"></i> {reminder.responseTime}
            </span>
          )}
        </div>
        
        <div className="reminder-content">
          <div className="reminder-type">
            <span className="type-icon">{getTypeIcon(reminder.type)}</span>
            <span className="type-text">{t.reminderTypes[reminder.type]}</span>
          </div>
          
          <h3 className="reminder-title">{reminder.title}</h3>
          
          {reminder.audioUrl ? (
            <div className="voice-message with-audio">
              <i className="bi bi-music-note"></i> 
              <span>Audio recording</span>
              <button 
                className={`play-audio-btn ${isPlaying ? 'playing' : ''}`}
                onClick={playAudio}
              >
                <i className={`bi ${isPlaying ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                {isPlaying ? t.recording.playing : t.recording.play}
              </button>
            </div>
          ) : (
            <div className="voice-message">
              <i className="bi bi-volume-up"></i>
              <span>{reminder.voiceMessage}</span>
            </div>
          )}

          <div className="reminder-status">
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(reminder.status) }}
            >
              {reminder.status === "completed" && t.completed}
              {reminder.status === "pending" && t.pending}
              {reminder.status === "ignored" && t.ignored}
            </span>
          </div>

          {reminder.status === "pending" && (
            <div className="reminder-actions">
              <button 
                className="action-btn complete"
                onClick={() => handleResponse(reminder.id, "completed")}
              >
                <i className="bi bi-check-circle"></i>
                {t.markCompleted}
              </button>
              <button 
                className="action-btn later"
                onClick={() => handleResponse(reminder.id, "later")}
              >
                <i className="bi bi-clock"></i>
                {t.markLater}
              </button>
            </div>
          )}

          {reminder.status === "ignored" && (
            <div className="alert-banner">
              <i className="bi bi-exclamation-triangle"></i>
              <span>{t.alerts.noResponse}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const AddCard = ({ type, isOpen, onClose, onSave, initialData }) => {
    const [localData, setLocalData] = useState(initialData || {
      title: "",
      time: "",
      type: type === "patient" ? "task" : "medication",
      voiceMessage: "",
      repeat: type === "patient" ? "once" : "daily",
      audioBlob: null
    });
    
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null);
    
    if (!isOpen) return null;
    
    const isPatient = type === "patient";
    
    const handleSave = () => {
      onSave(localData);
    };
    
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);
          setLocalData({...localData, audioBlob: audioBlob});
          
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        alert(lang === "en" 
          ? "Could not access microphone. Please check permissions." 
          : "لا يمكن الوصول إلى الميكروفون. يرجى التحقق من الصلاحيات.");
      }
    };

    const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    };

    const playRecording = () => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    };

    const deleteRecording = () => {
      setAudioURL(null);
      setLocalData({...localData, audioBlob: null});
      setIsPlaying(false);
    };
    
    const handleClose = () => {
      onClose();
      setLocalData(initialData || {
        title: "",
        time: "",
        type: type === "patient" ? "task" : "medication",
        voiceMessage: "",
        repeat: type === "patient" ? "once" : "daily",
        audioBlob: null
      });
      setAudioURL(null);
      setIsRecording(false);
    };
    
    return (
      <div className="add-card">
        <div className={`add-card-header ${isPatient ? "patient" : "family"}`}>
          <i className={`bi bi-${isPatient ? "person-plus" : "people"}`}></i>
          <h3>{isPatient ? t.addPatientReminder : t.addFamilyReminder}</h3>
        </div>
        
        <div className="add-card-content">
          <div className="form-group large">
            <label className="form-label-large">
              {t.form.whatToRemember}
            </label>
            <input
              type="text"
              value={localData.title}
              onChange={(e) => setLocalData({...localData, title: e.target.value})}
              placeholder={t.form.example}
              className="large-input"
              autoFocus
            />
          </div>

          <div className="form-row time-type-row">
            <div className="form-group time-group">
              <label>{t.form.time}</label>
              <div className="time-native-wrapper">
                <input
                  type="time"
                  value={localData.time}
                  onChange={(e) => setLocalData({...localData, time: e.target.value})}
                  className="time-native-input"
                  step="60" 
                />
                <i className="bi bi-clock"></i>
              </div>
            </div>

            <div className="form-group type-group">
              <label>{t.form.type}</label>
              <div className="type-select-wrapper">
                <select
                  value={localData.type}
                  onChange={(e) => setLocalData({...localData, type: e.target.value})}
                  className="type-select"
                >
                  <option value="task">{t.reminderTypes.task}</option>
                  <option value="medication">{t.reminderTypes.medication}</option>
                  <option value="hydration">{t.reminderTypes.hydration}</option>
                  <option value="appointment">{t.reminderTypes.appointment}</option>
                </select>
                <i className="bi bi-chevron-down"></i>
              </div>
            </div>
          </div>

          <div className="form-group repeat-group">
            <label>{t.form.repeat}</label>
            <div className="repeat-options">
              <button 
                type="button"
                className={`repeat-option ${localData.repeat === "once" ? "active" : ""}`}
                onClick={() => setLocalData({...localData, repeat: "once"})}
              >
                {t.form.once}
              </button>
              <button 
                type="button"
                className={`repeat-option ${localData.repeat === "daily" ? "active" : ""}`}
                onClick={() => setLocalData({...localData, repeat: "daily"})}
              >
                {t.form.daily}
              </button>
              <button 
                type="button"
                className={`repeat-option ${localData.repeat === "weekly" ? "active" : ""}`}
                onClick={() => setLocalData({...localData, repeat: "weekly"})}
              >
                {t.form.weekly}
              </button>
            </div>
          </div>
          
          <div className="form-group voice-group">
            <label>
              {t.form.voiceMessage}
              {isPatient && <span className="optional">({t.form.optional})</span>}
            </label>
            
            <div className="voice-recording-area">
              {!audioURL ? (
                <button 
                  type="button"
                  className={`record-btn ${isRecording ? "recording" : ""}`}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  <i className={`bi ${isRecording ? "bi-stop-circle" : "bi-mic-fill"}`}></i>
                  <span>
                    {isRecording 
                      ? t.recording.recording
                      : t.recording.clickToRecord
                    }
                  </span>
                </button>
              ) : (
                <div className="recording-preview">
                  <audio 
                    ref={audioRef} 
                    src={audioURL} 
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div className="audio-wave">
                    <span></span><span></span><span></span><span></span><span></span>
                  </div>
                  <div className="recording-actions">
                    <button 
                      type="button"
                      className={`play-recording ${isPlaying ? 'playing' : ''}`}
                      onClick={playRecording}
                    >
                      <i className={`bi ${isPlaying ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                      {isPlaying ? t.recording.playing : t.recording.play}
                    </button>
                    <button 
                      type="button"
                      className="delete-recording"
                      onClick={deleteRecording}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              className="save-btn"
              onClick={handleSave}
              disabled={!localData.title || !localData.time}
            >
              {t.form.save}
            </button>
            <button 
              className="cancel-btn"
              onClick={handleClose}
            >
              {t.form.cancel}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const calculateLast7DaysRates = () => {
    const rates = [];
    const today = new Date();
    
    const dayNames = lang === "en" 
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayIndex = date.getDay(); 
      const dayName = dayNames[dayIndex];
      const dayReminders = reminders.filter(r => r.date === dateStr);
      
      if (dayReminders.length > 0) {
        const completedCount = dayReminders.filter(r => r.status === "completed").length;
        const rate = Math.round((completedCount / dayReminders.length) * 100);
        rates.push({
          day: dayName,
          rate: rate,
          date: dateStr,
          count: dayReminders.length,
          completed: completedCount
        });
      } else {
        rates.push({
          day: dayName,
          rate: 0,
          date: dateStr,
          count: 0,
          completed: 0,
          noData: true
        });
      }
    }
    console.log("Chart rates:", rates); 
    return rates;
  };

  return (
    <div className="reminder-container" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="reminder-header">
        <button className="back-btn" onClick={() => navigateTo("home")}>
          <i className="bi bi-arrow-left"></i>
          {t.back}
        </button>
        
        <div className="header-title">
          <h1>{t.title}</h1>
          <p className="subtitle">{t.subtitle}</p>
        </div>

        <div className="view-toggle">
          <button 
            className={`view-btn ${view === "patient" ? "active" : ""}`}
            onClick={() => setView("patient")}
          >
            <i className="bi bi-person"></i>
            {t.patientView}
          </button>
          <button 
            className={`view-btn ${view === "family" ? "active" : ""}`}
            onClick={() => setView("family")}
          >
            <i className="bi bi-people"></i>
            {t.familyView}
          </button>
        </div>
      </div>

      {view === "patient" ? (
        <div className="patient-view">
          <div className="stats-overview">
            <div className="stat-item">
              <span className="stat-value">{stats.todayCompleted}/{stats.todayTotal}</span>
              <span className="stat-label">{t.todayReminders}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.adherenceRate}%</span>
              <span className="stat-label">{t.adherence}</span>
            </div>
          </div>

          <div className="add-cards-container">
            <div className="add-card-wrapper">
              {!showPatientAddCard ? (
                <button 
                  className="open-add-card patient"
                  onClick={handleOpenPatientCard}
                >
                  <span className="add-card-title">{t.addPatientReminder}</span>
                </button>
              ) : (
                <AddCard
                  type="patient"
                  isOpen={showPatientAddCard}
                  onClose={handleCloseAllCards}
                  onSave={handleAddPatientReminder}
                  initialData={{
                    title: "",
                    time: "",
                    type: "task",
                    voiceMessage: "",
                    repeat: "once",
                    audioBlob: null
                  }}
                />
              )}
            </div>

            <div className="add-card-wrapper">
              {!showFamilyAddCard ? (
                <button 
                  className="open-add-card family"
                  onClick={handleOpenFamilyCard}
                >
                  <span className="add-card-title">{t.addFamilyReminder}</span>
                </button>
              ) : (
                <AddCard
                  type="family"
                  isOpen={showFamilyAddCard}
                  onClose={handleCloseAllCards}
                  onSave={handleAddFamilyReminder}
                  initialData={{
                    title: "",
                    time: "",
                    type: "medication",
                    voiceMessage: "",
                    repeat: "daily",
                    audioBlob: null
                  }}
                />
              )}
            </div>
          </div>

          <div className="filter-tabs">
            <button 
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              {t.allReminders} ({reminders.length})
            </button>
            <button 
              className={`filter-btn ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              ⏳ {t.pending} ({reminders.filter(r => r.status === "pending").length})
            </button>
            <button 
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              ✅ {t.completed} ({reminders.filter(r => r.status === "completed").length})
            </button>
          </div>

          {getFilteredReminders(todayReminders).length > 0 && (
            <div className="reminders-section">
              <h2 className="section-title">
                <i className="bi bi-sun"></i>
                {t.todayReminders}
              </h2>
              <div className="reminders-grid">
                {getFilteredReminders(todayReminders).map(reminder => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </div>
            </div>
          )}

          {getFilteredReminders(previousReminders).length > 0 && (
            <div className="reminders-section">
              <h2 className="section-title">
                <i className="bi bi-calendar"></i>
                {t.previousReminders}
              </h2>
              <div className="reminders-grid">
                {getFilteredReminders(previousReminders).map(reminder => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </div>
            </div>
          )}

          {reminders.length === 0 && (
            <div className="no-reminders">
              <i className="bi bi-check-circle"></i>
              <p>{t.noReminders}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="family-view">
          <div className="dashboard-header-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <span className="stat-value">{stats.adherenceRate}%</span>
                <span className="stat-label">{t.adherence}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <span className="stat-value">{stats.completed}</span>
                <span className="stat-label">{t.completed}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <span className="stat-value">{stats.pending}</span>
                <span className="stat-label">{t.pending}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-info">
                <span className="stat-value">{stats.ignored}</span>
                <span className="stat-label">{t.ignored}</span>
              </div>
            </div>
          </div>

          <div className="adherence-chart">
            <h3>
              <i className="bi bi-graph-up"></i>
              {t.adherence} - Last 7 Days
            </h3>
            <div className="adherence-value">
              <span className="adherence-number">{stats.adherenceRate}%</span>
              <span className="adherence-label">{t.adherence}</span>
            </div>
            <div className="chart-bars">
              {calculateLast7DaysRates().map((item, index) => {
                const barHeightPx = item.rate * 2;
                return (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className={`chart-bar ${item.rate === 0 ? 'zero' : ''} ${item.noData ? 'no-data' : ''}`}
                      style={{ 
                       height: `${barHeightPx}px`,
                       minHeight: item.rate === 0 ? '8px' : '0'
                      }}
                    >
                      <span className="bar-value">{item.rate}%</span>
                      {item.noData && (
                        <span className="no-data-label" title="No reminders this day">-</span>
                      )}
                    </div>
                    <span className="bar-label">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="response-log">
            <h3>
              <i className="bi bi-table"></i>
              {t.allReminders}
            </h3>
            <table className="response-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reminder</th>
                  <th>Type</th>
                  <th>Added By</th>
                  <th>Response</th>
                  <th>Response Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reminders.sort((a, b) => new Date(b.date) - new Date(a.date)).map(reminder => (
                  <tr key={reminder.id}>
                    <td>{reminder.date}</td>
                    <td>{reminder.displayTime || convertTo12Hour(reminder.time)}</td>
                    <td>{reminder.title}</td>
                    <td>
                      <span className="type-badge" style={{
                        backgroundColor: reminder.type === "medication" ? "#e3f2fd" :
                                       reminder.type === "hydration" ? "#e8f5e8" :
                                       reminder.type === "appointment" ? "#fff3e0" : "#f3e5f5",
                        color: reminder.type === "medication" ? "#1976d2" :
                               reminder.type === "hydration" ? "#2e7d32" :
                               reminder.type === "appointment" ? "#f57c00" : "#7b1fa2"
                      }}>
                        {getTypeIcon(reminder.type)} {t.reminderTypes[reminder.type]}
                      </span>
                    </td>
                    <td>
                      <span className={`added-by-badge ${reminder.createdBy}`}>
                        <i className={`bi bi-${reminder.createdBy === "patient" ? "person" : "people"}`}></i>
                        {reminder.createdBy === "patient" ? "Patient" : "Family"}
                      </span>
                    </td>
                    <td>
                      {reminder.response === "completed" && (
                        <span className="response-badge completed">
                          <i className="bi bi-check-circle"></i> {t.completed}
                        </span>
                      )}
                      {reminder.response === "ignored" && (
                        <span className="response-badge ignored">
                          <i className="bi bi-x-circle"></i> {t.ignored}
                        </span>
                      )}
                      {!reminder.response && (
                        <span className="response-badge pending">
                          <i className="bi bi-hourglass"></i> {t.pending}
                        </span>
                      )}
                    </td>
                    <td>{reminder.responseTime || "-"}</td>
                    <td>
                      <span className="status-indicator" style={{
                        backgroundColor: reminder.status === "completed" ? "#28a745" :
                                        reminder.status === "pending" ? "#ffc107" : "#dc3545"
                      }}></span>
                    </td>
                    <td>
                      <button 
                        className="table-delete-btn"
                        onClick={() => handleDeleteReminder(reminder.id)}
                        title={t.delete}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}