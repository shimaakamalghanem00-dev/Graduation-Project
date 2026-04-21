import React, { useState, useEffect } from "react";
import './memories.css';

function Memories({ lang, navigateTo, userType = "family" }) {
    const [showUploadOptions, setShowUploadOptions] = useState(false);
    const [stats, setStats] = useState({
        photos: 0,
        videos: 0,
        voice: 0
    });

    const calculateStats = () => {
        const savedMemories = localStorage.getItem('memories');
        if (savedMemories) {
            const memories = JSON.parse(savedMemories);
            const photos = memories.filter(m => m.type === "photo").length;
            const videos = memories.filter(m => m.type === "video").length;
            const voice = memories.filter(m => m.type === "voice").length;
            setStats({ photos, videos, voice });
        } else {
            setStats({ photos: 0, videos: 0, voice: 0 });
        }
    };

    useEffect(() => {
        calculateStats();

        const handleMemoryUpdate = () => {
            calculateStats();
        };

        window.addEventListener('memoryUpdated', handleMemoryUpdate);

        return () => {
            window.removeEventListener('memoryUpdated', handleMemoryUpdate);
        };
    }, []);

    return (
        <div className="memories-page">
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
                            onClick={() => navigateTo("home")}
                        >
                            {lang === "en" ? "Back to Home" : "العودة للرئيسية"}
                        </button>
                    </div>
                </nav>
            </div>
            
            <div className="mem-header-section">
                <h1>
                    <i className="bi bi-heart-fill"></i>
                    {lang === "en" ? "Memories"  : "الذكريات"}
                </h1>
                <p>
                    {lang === "en"
                        ? "Save your precious moments with family and loved ones"
                        : "احفظ لحظاتك الجميلة مع العائلة والأحباب"}
                </p>

                <div className="mem-stats-wrapper">
                    <div className="mem-stat-item">
                        <span className="mem-stat-number">{stats.photos}</span>
                        <span className="mem-stat-label">
                            {lang === "en" ? "Photos" : "صور"}
                        </span>
                    </div>
                    <div className="mem-stat-item">
                        <span className="mem-stat-number">{stats.videos}</span>
                        <span className="mem-stat-label">
                            {lang === "en" ? "Videos" : "فيديوهات"}
                        </span>
                    </div>
                    <div className="mem-stat-item">
                        <span className="mem-stat-number">{stats.voice}</span>
                        <span className="mem-stat-label">
                            {lang === "en" ? "Voice" : "تسجيلات"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mem-container mt-4">
                <h1 className="mem-page-title">
                    {lang === "en" ? "Add New Memory" : "أضف ذكرى جديدة"}
                </h1>
                <h6 className="mem-subtitle">
                    {lang === "en" ? "Choose one to create new memories" : "اختر واحدة لصنع ذكرى جديدة"}
                </h6>

                <div className="mem-cards-container">
                    <div className="mem-card-item">
                        <div className="card-body text-center">
                            <i className="bi bi-images" style={{ fontSize: "3rem", color: "#9B8FD9", marginBottom: "1rem" }}></i>
                            <h5 className="mem-card-title">
                                {lang === "en" ? "Photos" : "الصور"}
                            </h5>
                            <p className="mem-card-text">
                                {lang === "en" ? "Save your favorite moments" : "احفظ لحظاتك المفضلة"}
                            </p>
                            <button
                                className="mem-custom-btn"
                                onClick={() => navigateTo("iMemories")}
                            >
                                <i className="bi bi-plus-circle"></i>
                                {lang === "en" ? "Add Photo" : "أضف صورة"}
                            </button>
                        </div>
                    </div>

                    <div className="mem-card-item">
                        <div className="card-body text-center">
                            <i className="bi bi-camera-reels" style={{ fontSize: "3rem", color: "#9B8FD9", marginBottom: "1rem" }}></i>
                            <h5 className="mem-card-title">
                                {lang === "en" ? "Videos" : "الفيديو"}
                            </h5>
                            <p className="mem-card-text">
                                {lang === "en" ? "Record special moments" : "سجل لحظاتك الخاصة"}
                            </p>
                            <button
                                className="mem-custom-btn"
                                onClick={() => navigateTo("vmemories")}
                            >
                                <i className="bi bi-plus-circle"></i>
                                {lang === "en" ? "Add Video" : "أضف فيديو"}
                            </button>
                        </div>
                    </div>

                    <div className="mem-card-item">
                        <div className="card-body text-center">
                            <i className="bi bi-mic" style={{ fontSize: "3rem", color: "#9B8FD9", marginBottom: "1rem" }}></i>
                            <h5 className="mem-card-title">
                                {lang === "en" ? "Voice Notes" : "تسجيلات صوتية"}
                            </h5>
                            <p className="mem-card-text">
                                {lang === "en" ? "Record voice messages" : "سجل رسائل صوتية"}
                            </p>
                            <button
                                className="mem-custom-btn"
                                onClick={() => navigateTo("rmemories")}
                            >
                                <i className="bi bi-plus-circle"></i>
                                {lang === "en" ? "Add Voice" : "أضف تسجيل"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mem-show-center mt-5 mb-5">
                    <button
                        className="mem-custom-btn"
                        onClick={() => navigateTo("allmemories")}
                        style={{ width: "auto", padding: "1rem 3rem" }}
                    >
                        <i className="bi bi-grid-3x3-gap-fill"></i>
                        {lang === "en" ? "View All Memories" : "عرض كل الذكريات"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Memories;