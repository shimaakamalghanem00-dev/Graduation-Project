import React, { useState, useRef } from "react";
import './memories.css';

function Rmemories({ lang, navigateTo }) {
    const [voiceTitle, setVoiceTitle] = useState("");
    const [voiceDescription, setVoiceDescription] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const timerRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];
            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };
            mediaRecorder.current.onstop = () => {
                const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
                setRecordedBlob(blob);
            };
            mediaRecorder.current.start();
            setIsRecording(true);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (error) {
            alert(lang === "en"
                ? "Cannot access microphone. Please check permissions."
                : "لا يمكن الوصول إلى الميكروفون. تأكد من الصلاحيات.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // replace API
    const convertBlobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!recordedBlob && !isRecording) {
            alert(lang === "en"
                ? "Please record a voice message first"
                : "الرجاء تسجيل رسالة صوتية أولاً");
            return;
        }
        
        setIsSaving(true);
        try {
            const base64Audio = await convertBlobToBase64(recordedBlob);
            const newMemory = {
                id: Date.now().toString(),
                title: voiceTitle,
                description: voiceDescription,
                type: "voice",
                date: new Date().toISOString(),
                imageUrl: base64Audio,
                uploadedBy: "User"
            };

            // save localStorage
            const existingMemories = JSON.parse(localStorage.getItem('memories') || '[]');
            existingMemories.push(newMemory);
            localStorage.setItem('memories', JSON.stringify(existingMemories));

            // updated
            window.dispatchEvent(new Event('memoryUpdated'));

            alert(lang === "en" ? "Voice recorded successfully!" : "تم تسجيل الصوت بنجاح!");
            navigateTo("memories");
        } catch (error) {
            alert(lang === "en" ? "Error saving voice" : "خطأ في حفظ الصوت");
        } finally {
            setIsSaving(false);
        }
    };

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
                        onClick={() => navigateTo("memories")}
                    >
                        {lang === "en" ? "Back" : "رجوع"}
                    </button>
                </div>
            </nav>
            <div className="mem-container mt-5">
                <div className="mem-row justify-content-center">
                    <div className="mem-col-md-8">
                        <div className="mem-form-card">
                            <h2 className="mem-form-title mb-4">
                                {lang === "en" ? "Add Voice Recording" : "إضافة تسجيل صوتي"}
                            </h2>
                            <form onSubmit={handleSubmit}>
                              
                                <div className="mem-form-group mb-3">
                                    <label className="mem-form-label fw-bold">
                                        {lang === "en" ? "Recording Title" : "عنوان التسجيل"}
                                    </label>
                                    <input
                                        type="text"
                                        className="mem-form-control mem-form-control-lg"
                                        value={voiceTitle}
                                        onChange={(e) => setVoiceTitle(e.target.value)}
                                        required
                                    />
                                </div>
                              
                                <div className="mem-form-group mb-3">
                                    <label className="mem-form-label fw-bold">
                                        {lang === "en" ? "Description" : "الوصف"}
                                    </label>
                                    <textarea
                                        className="mem-form-control"
                                        rows="3"
                                        value={voiceDescription}
                                        onChange={(e) => setVoiceDescription(e.target.value)}
                                    ></textarea>
                                </div>
                               
                                <div className="mem-voice-recorder mb-4">
                                    <div className="mem-record-animation">
                                        <i className="bi bi-mic-fill"></i>
                                    </div>
                                    <div className="mem-record-timer">
                                        {formatTime(recordingTime)}
                                    </div>
                                    <div className="text-center">
                                        {!isRecording && !recordedBlob && (
                                            <button
                                                type="button"
                                                className="mem-record-btn"
                                                onClick={startRecording}
                                            >
                                                <i className="bi bi-record-circle"></i>
                                                {lang === "en" ? "Start Recording" : "بدء التسجيل"}
                                            </button>
                                        )}
                                        {isRecording && (
                                            <button
                                                type="button"
                                                className="mem-stop-btn"
                                                onClick={stopRecording}
                                            >
                                                <i className="bi bi-stop-circle"></i>
                                                {lang === "en" ? "Stop Recording" : "إيقاف التسجيل"}
                                            </button>
                                        )}
                                        {recordedBlob && !isRecording && (
                                            <div className="mt-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-success me-2"
                                                    onClick={() => {
                                                        const audio = new Audio(URL.createObjectURL(recordedBlob));
                                                        audio.play();
                                                    }}
                                                >
                                                    <i className="bi bi-play-circle"></i>
                                                    {lang === "en" ? "Play" : "استماع"}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-warning"
                                                    onClick={() => {
                                                        setRecordedBlob(null);
                                                        setRecordingTime(0);
                                                    }}
                                                >
                                                    <i className="bi bi-arrow-repeat"></i>
                                                    {lang === "en" ? "Re-record" : "إعادة تسجيل"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                               
                                <div className="mem-action-buttons d-flex gap-3">
                                    <button
                                        type="submit"
                                        className="mem-btn mem-btn-save flex-grow-1"
                                        disabled={!recordedBlob && !isRecording || isSaving}
                                    >
                                        <i className="bi bi-save"></i>
                                        {lang === "en" ? "Save Recording" : "حفظ التسجيل"}
                                    </button>
                                    <button
                                        type="button"
                                        className="mem-btn mem-btn-cancel flex-grow-1"
                                        onClick={() => navigateTo("memories")}
                                    >
                                        {lang === "en" ? "Cancel" : "إلغاء"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Rmemories;