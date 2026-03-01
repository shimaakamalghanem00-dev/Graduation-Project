import React, { useState, useEffect } from "react";
import './memories.css';

function AllMemories({ lang, navigateTo }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all"); 
    const [memories, setMemories] = useState([]);
    const [selectedMemory, setSelectedMemory] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const loadMemories = () => {
        const savedMemories = localStorage.getItem('memories');
        if (savedMemories) {
            setMemories(JSON.parse(savedMemories));
        }
    };

    useEffect(() => {
        loadMemories();

        const handleMemoryUpdate = () => {
            loadMemories();
        };

        window.addEventListener('memoryUpdated', handleMemoryUpdate);

        return () => {
            window.removeEventListener('memoryUpdated', handleMemoryUpdate);
        };
    }, []);

    const filteredMemories = memories.filter(memory => {
        if (filter !== "all" && memory.type !== filter) return false;
        if (searchTerm && !memory.title.includes(searchTerm) && !memory.description.includes(searchTerm)) return false;
        return true;
    });

    const getTypeIcon = (type) => {
        switch(type) {
            case "photo": return "bi-image-fill";
            case "video": return "bi-camera-reels-fill";
            case "voice": return "bi-mic-fill";
            default: return "bi-file-fill";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(lang === "en" ? "en-US" : "ar-EG", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const openMemory = (memory) => {
        setSelectedMemory(memory);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedMemory(null);
    };

    const handleDeleteMemory = (id, e) => {
        e.stopPropagation();
        if (window.confirm(lang === "en" ? "Are you sure you want to delete this memory?" : "هل أنت متأكد من حذف هذه الذكرى؟")) {
            const updatedMemories = memories.filter(memory => memory.id !== id);
            setMemories(updatedMemories);
            localStorage.setItem('memories', JSON.stringify(updatedMemories));
            window.dispatchEvent(new Event('memoryUpdated'));
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
                        {lang === "en" ? "Back to Memories" : "العودة للذكريات"}
                    </button>
                </div>
            </nav>
            <div className="mem-main-container">
                <div className="mem-header-section">
                    <h1>
                        <i className="bi bi-grid-3x3-gap-fill"></i>
                        {lang === "en" ? "All Memories" : "كل الذكريات"}
                    </h1>
                    <p>
                        {lang === "en"
                            ? "Browse all your saved memories"
                            : "تصفح جميع ذكرياتك المحفوظة"}
                    </p>

                    {memories.length > 0 && (
                        <div className="mem-count-badge">
                            {lang === "en"
                                ? `You have ${memories.length} memories`
                                : `لديك ${memories.length} ذكرى`}
                        </div>
                    )}
                </div>

                {memories.length > 0 && (
                    <div className="mem-toolbar-wrapper">
                        <div className="mem-search-box">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                placeholder={lang === "en" ? "Search memories..." : "ابحث في الذكريات..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="mem-filter-group">
                            <button
                                className={`mem-filter-btn ${filter === "all" ? "mem-active" : ""}`}
                                onClick={() => setFilter("all")}
                            >
                                <i className="bi bi-grid-3x3-gap-fill"></i>
                                {lang === "en" ? "All" : "الكل"}
                            </button>
                            <button
                                className={`mem-filter-btn ${filter === "photo" ? "mem-active" : ""}`}
                                onClick={() => setFilter("photo")}
                            >
                                <i className="bi bi-image-fill"></i>
                                {lang === "en" ? "Photos" : "صور"}
                            </button>
                            <button
                                className={`mem-filter-btn ${filter === "video" ? "mem-active" : ""}`}
                                onClick={() => setFilter("video")}
                            >
                                <i className="bi bi-camera-reels-fill"></i>
                                {lang === "en" ? "Videos" : "فيديو"}
                            </button>
                            <button
                                className={`mem-filter-btn ${filter === "voice" ? "mem-active" : ""}`}
                                onClick={() => setFilter("voice")}
                            >
                                <i className="bi bi-mic-fill"></i>
                                {lang === "en" ? "Voice" : "صوت"}
                            </button>
                        </div>
                    </div>
                )}

                {filteredMemories.length > 0 ? (
                    <div className="mem-grid-layout">
                        {filteredMemories.map(memory => (
                            <div
                                key={memory.id}
                                className={`mem-item-card mem-${memory.type}-type`}
                                onClick={() => openMemory(memory)}
                            >
                                <div className="mem-type-indicator">
                                    <i className={`bi ${getTypeIcon(memory.type)}`}></i>
                                </div>

                                <button
                                    className="mem-delete-btn"
                                    onClick={(e) => handleDeleteMemory(memory.id, e)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                                {memory.type === "photo" ? (
                                    <div className="mem-image-area">
                                        <img src={memory.imageUrl} alt={memory.title} />
                                    </div>
                                ) : memory.type === "video" ? (
                                    <div className="mem-image-area">
                                        <img src={memory.imageUrl || "https://via.placeholder.com/300?text=Video"} alt={memory.title} />
                                        <div className="mem-play-overlay">
                                            <i className="bi bi-play-circle-fill"></i>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mem-voice-area">
                                        <i className="bi bi-mic-fill"></i>
                                    </div>
                                )}
                                <div className="mem-content-area">
                                    <h3 className="mem-content-title">{memory.title}</h3>
                                    <p className="mem-content-description">{memory.description}</p>
                                    <div className="mem-footer-info">
                                        <span>
                                            <i className="bi bi-calendar3"></i>
                                            {formatDate(memory.date)}
                                        </span>
                                        <span>
                                            <i className="bi bi-person-circle"></i>
                                            {memory.uploadedBy}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (

                    <div className="mem-empty-state">
                        <i className="bi bi-heart"></i>
                        <h3>
                            {lang === "en" ? "No memories yet" : "لا توجد ذكريات حتى الآن"}
                        </h3>
                    </div>
                )}
            </div>

            {showModal && selectedMemory && (
                <div className="mem-modal-overlay" onClick={closeModal}>
                    <div className="mem-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="mem-modal-close" onClick={closeModal}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                        
                        {selectedMemory.type === "photo" && (
                            <div className="mem-modal-body">
                                <h2 className="mem-modal-title">{selectedMemory.title}</h2>
                                <p className="mem-modal-description">{selectedMemory.description}</p>
                                <div className="mem-modal-image-container">
                                    <img src={selectedMemory.imageUrl} alt={selectedMemory.title} />
                                </div>
                                <div className="mem-modal-footer">
                                    <span>
                                        <i className="bi bi-calendar3"></i>
                                        {formatDate(selectedMemory.date)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {selectedMemory.type === "video" && (
                            <div className="mem-modal-body">
                                <h2 className="mem-modal-title">{selectedMemory.title}</h2>
                                <p className="mem-modal-description">{selectedMemory.description}</p>
                                <div className="mem-modal-video-container">
                                    <video controls width="100%">
                                        <source src={selectedMemory.imageUrl} type="video/mp4" />
                                        {lang === "en" ? "Your browser does not support the video tag." : "المتصفح لا يدعم عرض الفيديو"}
                                    </video>
                                </div>
                                <div className="mem-modal-footer">
                                    <span>
                                        <i className="bi bi-calendar3"></i>
                                        {formatDate(selectedMemory.date)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {selectedMemory.type === "voice" && (
                            <div className="mem-modal-body">
                                <h2 className="mem-modal-title">{selectedMemory.title}</h2>
                                <p className="mem-modal-description">{selectedMemory.description}</p>
                                <div className="mem-modal-audio-container">
                                    <div className="mem-audio-player">
                                        <i className="bi bi-soundwave"></i>
                                        <audio controls>
                                            <source src={selectedMemory.imageUrl} type="audio/wav" />
                                            {lang === "en" ? "Your browser does not support the audio tag." : "المتصفح لا يدعم تشغيل الصوت"}
                                        </audio>
                                    </div>
                                </div>
                                <div className="mem-modal-footer">
                                    <span>
                                        <i className="bi bi-calendar3"></i>
                                        {formatDate(selectedMemory.date)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AllMemories;