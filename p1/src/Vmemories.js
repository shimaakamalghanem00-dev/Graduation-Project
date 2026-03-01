import React, { useState } from "react";
import './memories.css';

function Vmemories({ lang, navigateTo }) {
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState("");
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedVideo(file);
        }
    };

    // replace API
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedVideo) return;

        setIsSaving(true);
        try {
            const base64Video = await convertToBase64(selectedVideo);
            const newMemory = {
                id: Date.now().toString(),
                title: videoTitle,
                description: videoDescription,
                type: "video",
                date: new Date().toISOString(),
                imageUrl: base64Video,
                uploadedBy: "User"
            };

            // save localStorage
            const existingMemories = JSON.parse(localStorage.getItem('memories') || '[]');
            existingMemories.push(newMemory);
            localStorage.setItem('memories', JSON.stringify(existingMemories));

            //updated
            window.dispatchEvent(new Event('memoryUpdated'));

            alert(lang === "en" ? "Video saved successfully!" : "تم حفظ الفيديو بنجاح!");
            navigateTo("memories");
        } catch (error) {
            alert(lang === "en" ? "Error saving video (File might be too large)" : "خطأ في حفظ الفيديو (الملف كبير جداً)");
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
                                {lang === "en" ? "Add New Video" : "إضافة فيديو جديد"}
                            </h2>
                            <form onSubmit={handleSubmit}>
                        
                                <div className="mem-form-group mb-3">
                                    <label className="mem-form-label fw-bold">
                                        {lang === "en" ? "Video Title" : "عنوان الفيديو"}
                                    </label>
                                    <input
                                        type="text"
                                        className="mem-form-control mem-form-control-lg"
                                        value={videoTitle}
                                        onChange={(e) => setVideoTitle(e.target.value)}
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
                                        value={videoDescription}
                                        onChange={(e) => setVideoDescription(e.target.value)}
                                    ></textarea>
                                </div>
                             
                                <div className="mem-form-group mb-4">
                                    <label className="mem-form-label fw-bold">
                                        {lang === "en" ? "Choose Video" : "اختر الفيديو"}
                                    </label>
                                    <input
                                        type="file"
                                        className="mem-file-input"
                                        accept="video/*"
                                        onChange={handleVideoUpload}
                                        required
                                    />
                                    {selectedVideo && (
                                        <div className="mem-success-message">
                                            <i className="bi bi-check-circle-fill"></i>
                                            {lang === "en" ? " Video selected: " : " تم اختيار: "}
                                            {selectedVideo.name}
                                        </div>
                                    )}
                                </div>
                             
                                <div className="mem-action-buttons d-flex gap-3">
                                    <button type="submit" className="mem-btn mem-btn-save flex-grow-1" disabled={isSaving}>
                                        <i className="bi bi-save"></i>
                                        {lang === "en" ? "Save Video" : "حفظ الفيديو"}
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

export default Vmemories;