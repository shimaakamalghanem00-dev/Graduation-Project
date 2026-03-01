import React, { useState } from "react";
import './memories.css';

function IMemories({ lang, navigateTo }) {
    const [imageTitle, setImageTitle] = useState("");
    const [imageDescription, setImageDescription] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
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
        if (!selectedImage) return;

        setIsSaving(true);
        try {
            const base64Image = await convertToBase64(selectedImage);
            const newMemory = {
                id: Date.now().toString(),
                title: imageTitle,
                description: imageDescription,
                type: "photo",
                date: new Date().toISOString(),
                imageUrl: base64Image,
                uploadedBy: "User"
            };

            // save localStorage
            const existingMemories = JSON.parse(localStorage.getItem('memories') || '[]');
            existingMemories.push(newMemory);
            localStorage.setItem('memories', JSON.stringify(existingMemories));

            //Updated
            window.dispatchEvent(new Event('memoryUpdated'));

            alert(lang === "en" ? "Image saved successfully!" : "تم حفظ الصورة بنجاح!");
            navigateTo("memories");
        } catch (error) {
            alert(lang === "en" ? "Error saving image" : "خطأ في حفظ الصورة");
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
                                {lang === "en" ? "Add New Image" : "إضافة صورة جديدة"}
                            </h2>
                            <form onSubmit={handleSubmit}>
                            
                                <div className="mem-form-group mb-3">
                                    <label className="mem-form-label fw-bold">
                                        {lang === "en" ? "Image Title" : "عنوان الصورة"}
                                    </label>
                                    <input
                                        type="text"
                                        className="mem-form-control mem-form-control-lg"
                                        value={imageTitle}
                                        onChange={(e) => setImageTitle(e.target.value)}
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
                                        value={imageDescription}
                                        onChange={(e) => setImageDescription(e.target.value)}
                                    ></textarea>
                                </div>
                             
                                <div className="mem-form-group mb-4">
                                    <label className="mem-form-label fw-bold">
                                        {lang === "en" ? "Choose Image" : "اختر الصورة"}
                                    </label>
                                    <input
                                        type="file"
                                        className="mem-file-input"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        required
                                    />
                                    
                                    {previewUrl && (
                                        <div className="mt-3 text-center">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="mem-image-preview"
                                            />
                                        </div>
                                    )}
                                </div>
                              
                                <div className="mem-action-buttons d-flex gap-3">
                                    <button type="submit" className="mem-btn mem-btn-save flex-grow-1" disabled={isSaving}>
                                        <i className="bi bi-save"></i>
                                        {lang === "en" ? "Save Image" : "حفظ الصورة"}
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

export default IMemories;