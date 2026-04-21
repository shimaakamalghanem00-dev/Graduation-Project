<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* Fix marker icon problem */
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

/* Component to move map when position changes */
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

function GPS({ lang, navigateTo }) {

  const [position, setPosition] = useState([30.0444, 31.2357]);
  const [search, setSearch] = useState("");

  /* Get device current location */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition([
          pos.coords.latitude,
          pos.coords.longitude
        ]);
      });
    }
  }, []);

  /* Search location */
  const searchLocation = async () => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${search}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      setPosition([lat, lon]);
    }
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>

      {/* Navbar */}
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span
            className="navbarbrand fw-bold"
            style={{ cursor: "pointer" }}
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

      <div className="container mt-4">

        <p>
          {lang === "en"
            ? "Track your location and find nearby places."
            : "تتبع موقعك واعثر على الأماكن القريبة."}
        </p>

        {/* Search bar */}
        <div className="d-flex mb-3">
          <input
            type="text"
            className="form-control"
            placeholder={lang === "en" ? "Search location..." : "ابحث عن موقع"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="btn btn-primary ms-2"
            onClick={searchLocation}
          >
            {lang === "en" ? "Search" : "بحث"}
          </button>
        </div>
=======
import React, { useState, useEffect, useRef, useCallback } from "react";

// Constants 
const SAFE_ZONE = {
  center: { lat: 30.02645, lng: 31.49291 }, // Future University
  radiusMeters: 100,
  name: "Future University in Egypt"
};

const LOCATION_CONFIG = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
  updateIntervalMs: 10000 // 10 seconds
};

// Functions
const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth's radius in meters
  const toRad = (angle) => (angle * Math.PI) / 180;
  
  const lat1Rad  = toRad(lat1);
  const lat2Rad  = toRad(lat2);
  const deltaLatRad  = toRad(lat2 - lat1);
  const deltaLonRad  = toRad(lon2 - lon1);
  
  const a = Math.sin(deltaLatRad  / 2) * Math.sin(deltaLatRad  / 2) +
            Math.cos(lat1Rad ) * Math.cos(lat2Rad ) *
            Math.sin(deltaLonRad  / 2) * Math.sin(deltaLonRad  / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

const formatTimestamp = (date) => date.toLocaleTimeString();

// Hook location
const useGeolocation = (onLocationUpdate, onError) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      const errMsg = "Geolocation is not supported";
      setError(errMsg);
      onError?.(errMsg);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newLocation = { lat: latitude, lng: longitude, accuracy: Math.round(accuracy) };
        
        setLocation(newLocation);
        setError(null);
        setLoading(false);
        onLocationUpdate?.(newLocation);
      },
      (err) => {
        let errorMessage = getGeolocationErrorMessage(err);
        setError(errorMessage);
        onError?.(errorMessage);
        setLoading(false);
      },
      LOCATION_CONFIG
    );
  }, [onLocationUpdate, onError]);

  const startWatching = useCallback(() => {
    getCurrentPosition();
    
    if (watchIdRef.current) {
      clearInterval(watchIdRef.current);
    }
    
    watchIdRef.current = setInterval(getCurrentPosition, LOCATION_CONFIG.updateIntervalMs);
  }, [getCurrentPosition]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current) {
      clearInterval(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopWatching();
  }, [stopWatching]);

  return { location, loading, error, startWatching, getCurrentPosition };
};

const getGeolocationErrorMessage = (error) => {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      return "Location permission denied. Please enable GPS.";
    case error.POSITION_UNAVAILABLE:
      return "Location information unavailable";
    case error.TIMEOUT:
      return "Location request timed out";
    default:
      return "An error occurred while getting location";
  }
};

const useReverseGeocoding = () => {
  const [address, setAddress] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const fetchAddress = useCallback(async (lat, lng) => {
    if (!lat || !lng) return;
    
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data?.display_name) {
        const shortAddress = data.display_name.split(",").slice(0, 4).join(",");
        setAddress(shortAddress);
      } else {
        setAddress("📍 Location detected");
      }
    } catch (error) {
      setAddress("📍 Approximate location");
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);

  return { address, isLoadingAddress, fetchAddress };
};

const useSafeZoneMonitor = (location) => {
  const [isInside, setIsInside] = useState(true);
  const [distance, setDistance] = useState(0);
  const [justExited, setJustExited] = useState(false);

  useEffect(() => {
    if (!location) return;

    const distanceToSafeZone = calculateDistanceInMeters(
      location.lat, location.lng,
      SAFE_ZONE.center.lat, SAFE_ZONE.center.lng
    );
    
    setDistance(distanceToSafeZone);
    const inside = distanceToSafeZone <= SAFE_ZONE.radiusMeters;
    
    if (isInside !== inside) {
      setIsInside(inside);
      setJustExited(!inside);
      
      // Reset justExited flag after 5 seconds
      if (!inside) {
        setTimeout(() => setJustExited(false), 5000);
      }
    }
  }, [location, isInside]);

  return { isInside, distance, justExited };
};

const useAlertSystem = () => {
  const [activeAlert, setActiveAlert] = useState(null);
  const [alertHistory, setAlertHistory] = useState([]);

  const triggerAlert = useCallback((message, type = "emergency") => {
    const newAlert = {
      id: Date.now(),
      message,
      type,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    };
    
    setActiveAlert(newAlert);
    setAlertHistory(prev => [newAlert, ...prev].slice(0, 20));
    
    setTimeout(() => setActiveAlert(null), 5000);
    
    // Log to console for debugging
    console.log(`[ZEKRA ALERT - ${type.toUpperCase()}]:`, message);
  }, []);

  const clearAlert = useCallback(() => setActiveAlert(null), []);

  return { activeAlert, alertHistory, triggerAlert, clearAlert };
};

//Map Component
const LocationMap = ({ location, safeZone, lang, onMapReady }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    // Load Leaflet dynamically
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initializeMap();
      document.body.appendChild(script);
    } else {
      initializeMap();
    }
  }, []);

  const initializeMap = () => {
    if (mapRef.current) return;
    
    const center = location ? [location.lat, location.lng] : [safeZone.center.lat, safeZone.center.lng];
    
    mapRef.current = window.L.map('location-map').setView(center, 16);
    
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapRef.current);
    
    // Add marker
    if (location) {
      markerRef.current = window.L.marker([location.lat, location.lng])
        .addTo(mapRef.current)
        .bindTooltip(lang === "en" ? "📍 Your Location" : "📍 موقعك", { permanent: false });
    }
    
    // Draw safe zone circle
    circleRef.current = window.L.circle([safeZone.center.lat, safeZone.center.lng], {
      color: '#2c7da0',
      fillColor: '#9b8fd9',
      fillOpacity: 0.2,
      radius: safeZone.radiusMeters,
      weight: 2,
      dashArray: '6, 6'
    }).addTo(mapRef.current)
      .bindTooltip(lang === "en" ? safeZone.name : "المنطقة الآمنة", { permanent: false });
    
    onMapReady?.(mapRef.current);
  };

  // Update marker position when location changes
  useEffect(() => {
    if (markerRef.current && mapRef.current && location) {
      markerRef.current.setLatLng([location.lat, location.lng]);
      mapRef.current.setView([location.lat, location.lng], 16);
    }
  }, [location]);

  return (
    <div 
      id="location-map" 
      style={{ height: "460px", width: "100%", background: "#cbd5e1", borderRadius: "24px" }}
    />
  );
};

// UI Components 
const AlertNotification = ({ alert, lang }) => {
  if (!alert) return null;
  
  const getBackgroundColor = () => {
    switch(alert.type) {
      case "emergency": return "#dc3545";
      case "geofence": return "#ffc107";
      default: return "#28a745";
    }
  };
  
  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999,
      backgroundColor: getBackgroundColor(),
      color: "white",
      padding: "1rem 1.5rem",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      animation: "slideIn 0.3s ease",
      maxWidth: "350px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "1.5rem" }}></i>
        <span style={{ fontWeight: 600 }}>{alert.message}</span>
      </div>
    </div>
  );
};

const NavigationBar = ({ onBack, lang }) => (
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
      onClick={onBack}
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
      onClick={onBack}
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
);

const LocationInfoCard = ({ location, address, isInsideSafeZone, distance, lastUpdate, lang }) => (
  <div style={{
    background: "white",
    borderRadius: "32px",
    padding: "1.5rem",
    boxShadow: "0 12px 28px -8px rgba(0,0,0,0.1)"
  }}>
    <div style={{
      fontSize: "1.2rem",
      fontWeight: 700,
      color: "#1e3a4b",
      borderLeft: "5px solid #9B8FD9",
      paddingLeft: "1rem",
      marginBottom: "1.2rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
      <i className="bi bi-pin-map-fill" style={{ color: "#6BABE0" }}></i>
      {lang === "en" ? "Live Coordinates" : "الإحداثيات المباشرة"}
    </div>
    
    <div style={{
      background: "#f0f4fa",
      borderRadius: "24px",
      padding: "1rem",
      marginBottom: "1rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px dashed #cddfe7" }}>
        <span style={{ fontWeight: 600, color: "#4a6272" }}>Latitude:</span>
        <span style={{ fontFamily: "monospace", fontWeight: 500 }}>{location?.lat?.toFixed(6) || "---"}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px dashed #cddfe7" }}>
        <span style={{ fontWeight: 600, color: "#4a6272" }}>Longitude:</span>
        <span style={{ fontFamily: "monospace", fontWeight: 500 }}>{location?.lng?.toFixed(6) || "---"}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0" }}>
        <span style={{ fontWeight: 600, color: "#4a6272" }}>Accuracy:</span>
        <span>± {location?.accuracy || "---"} m</span>
      </div>
    </div>
    
    <div style={{
      background: isInsideSafeZone ? "#e9f5e9" : "#ffe6e5",
      borderRadius: "20px",
      padding: "1rem",
      borderLeft: `4px solid ${isInsideSafeZone ? "#2e7d32" : "#d32f2f"}`
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <i className={`bi ${isInsideSafeZone ? "bi-shield-check" : "bi-exclamation-triangle"}`} 
           style={{ color: isInsideSafeZone ? "#2e7d32" : "#d32f2f" }}></i>
        <span style={{ fontWeight: 500 }}>
          {isInsideSafeZone 
            ? (lang === "en" ? `✅ Inside safe zone (${Math.round(distance)}m from center)` : `✅ داخل المنطقة الآمنة (${Math.round(distance)}م من المركز)`)
            : (lang === "en" ? `⚠️ Outside safe zone! (${Math.round(distance)}m from center)` : `⚠️ خارج المنطقة الآمنة! (${Math.round(distance)}م من المركز)`)
          }
        </span>
      </div>
      <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
        <i className="bi bi-building"></i> {address || (lang === "en" ? "Loading address..." : "جاري تحميل العنوان...")}
      </div>
    </div>
    
    <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#999", textAlign: "center" }}>
      <i className="bi bi-clock-history"></i> {lang === "en" ? "Last update:" : "آخر تحديث:"} {formatTimestamp(lastUpdate)}
    </div>
  </div>
);

const BraceletStatusCard = ({ batteryLevel, braceletRemoved, lang }) => (
  <div style={{
    background: "white",
    borderRadius: "32px",
    padding: "1.5rem",
    boxShadow: "0 12px 28px -8px rgba(0,0,0,0.1)"
  }}>
    <div style={{
      fontSize: "1.2rem",
      fontWeight: 700,
      color: "#1e3a4b",
      borderLeft: "5px solid #9B8FD9",
      paddingLeft: "1rem",
      marginBottom: "1.2rem"
    }}>
      <i className="bi bi-shield-check"></i> {lang === "en" ? "Bracelet Status" : "حالة السوار"}
    </div>
    
    <div style={{
      background: "linear-gradient(115deg, #f8f9ff, #ffffff)",
      borderRadius: "28px",
      padding: "1rem 1.2rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <span><i className="bi bi-battery-full"></i> {lang === "en" ? "Battery" : "البطارية"}</span>
        <div style={{ width: "100px", background: "#e2e8f0", height: "10px", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ 
            width: `${batteryLevel}%`, 
            height: "100%", 
            background: batteryLevel > 20 ? "#2e7d32" : "#e63946", 
            borderRadius: "12px" 
          }}></div>
        </div>
        <span>{Math.round(batteryLevel)}%</span>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.85rem", background: "#eef2ff", padding: "0.6rem 1rem", borderRadius: "40px", flexWrap: "wrap" }}>
        <i className="bi bi-watch"></i>
        <span>
          {lang === "en" ? "Skin contact:" : "ملامسة الجلد:"} 
          <strong style={{ color: braceletRemoved ? "#d32f2f" : "#2e7d32", marginLeft: "0.3rem" }}>
            {braceletRemoved 
              ? (lang === "en" ? "REMOVED ⚠️" : "مخلوع ⚠️")
              : (lang === "en" ? "DETECTED ✓" : "ملامس ✓")
            }
          </strong>
        </span>
      </div>
    </div>
  </div>
);

const SOSButton = ({ onPress, lang }) => (
  <button 
    onClick={onPress}
    style={{
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
      boxShadow: "0 8px 25px rgba(220,53,69,0.4)",
      width: "100%",
      transition: "transform 0.2s ease",
      marginTop: "1rem"
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
  >
    <i className="bi bi-sos"></i>
    {lang === "en" ? "SOS - Call for Help" : "SOS - طلب مساعدة"}
  </button>
);

const RefreshButton = ({ onPress, lang }) => (
  <button
    onClick={onPress}
    style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#6BABE0",
      color: "white",
      border: "none",
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      zIndex: 1000,
      fontSize: "1.2rem",
      transition: "transform 0.2s ease"
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(180deg)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "rotate(0deg)"}
  >
    <i className="bi bi-arrow-repeat"></i>
  </button>
);

const LoadingScreen = ({ onRetry, lang }) => (
  <div style={{ textAlign: "center", padding: "3rem" }}>
    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📍</div>
    <h2>{lang === "en" ? "Getting your location..." : "جاري الحصول على موقعك..."}</h2>
    <p>{lang === "en" ? "Please allow location access" : "يرجى السماح بالوصول إلى الموقع"}</p>
    <button onClick={onRetry} style={{
      background: "#6BABE0",
      color: "white",
      border: "none",
      padding: "0.8rem 2rem",
      borderRadius: "25px",
      cursor: "pointer",
      marginTop: "1rem"
    }}>
      {lang === "en" ? "Allow Location" : "السماح بالموقع"}
    </button>
  </div>
);

const ErrorScreen = ({ error, onRetry, lang }) => (
  <div style={{ textAlign: "center", padding: "3rem" }}>
    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
    <h2>{lang === "en" ? "Location Error" : "خطأ في الموقع"}</h2>
    <p style={{ color: "red" }}>{error}</p>
    <button onClick={onRetry} style={{
      background: "#6BABE0",
      color: "white",
      border: "none",
      padding: "0.8rem 2rem",
      borderRadius: "25px",
      cursor: "pointer"
    }}>
      {lang === "en" ? "Try Again" : "حاول مرة أخرى"}
    </button>
  </div>
);

//  Main Component 
function GPS({ lang, navigateTo, userType = "patient" }) {
  const isFamily = userType === "family";
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [braceletRemoved, setBraceletRemoved] = useState(false);
  
  //  hook location
  const { activeAlert, alertHistory, triggerAlert } = useAlertSystem();
  const { address, fetchAddress } = useReverseGeocoding();
  
  const handleLocationUpdate = useCallback((location) => {
    setLastUpdate(new Date());
    fetchAddress(location.lat, location.lng);
  }, [fetchAddress]);
  
  const handleLocationError = useCallback((error) => {
    triggerAlert(error, "warning");
  }, [triggerAlert]);
  
  const { location, loading, error, startWatching, getCurrentPosition } = useGeolocation(
    handleLocationUpdate,
    handleLocationError
  );
  
  const { isInside: isInsideSafeZone, distance } = useSafeZoneMonitor(location);
  
  // Simulate battery drain
  useEffect(() => {
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => Math.max(5, prev - 0.3));
    }, 60000);
    return () => clearInterval(batteryInterval);
  }, []);
  
  // Trigger alert when exiting safe zone
  useEffect(() => {
    if (location && !isInsideSafeZone && distance > SAFE_ZONE.radiusMeters) {
      triggerAlert(
        lang === "en" 
          ? `⚠️ Patient exited safe zone! ${Math.round(distance)}m from ${SAFE_ZONE.name}`
          : `⚠️ خروج المريض من المنطقة الآمنة! ${Math.round(distance)}م من ${SAFE_ZONE.name}`,
        "geofence"
      );
    }
  }, [isInsideSafeZone, distance, location, triggerAlert, lang]);
  
  const handleRefreshLocation = () => {
    getCurrentPosition();
    triggerAlert(
      lang === "en" ? "📍 Refreshing location..." : "📍 يتم تحديث الموقع...",
      "info"
    );
  };
  
  const handleSOS = () => {
    triggerAlert(
      lang === "en" ? "🆘 SOS! Patient needs immediate assistance!" : "🆘 استغاثة! المريض يحتاج مساعدة فورية!",
      "emergency"
    );
  };
  
  // Loading state
  if (loading && !location) {
    return <LoadingScreen onRetry={startWatching} lang={lang} />;
  }
  
  // Error state
  if (error) {
    return <ErrorScreen error={error} onRetry={getCurrentPosition} lang={lang} />;
  }
  
  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} style={{ maxWidth: "1400px", margin: "0 auto", padding: "1rem" }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulseRed {
          0% { opacity: 0.7; box-shadow: 0 0 0 0 rgba(220,53,69,0.4); }
          70% { opacity: 1; box-shadow: 0 0 0 8px rgba(220,53,69,0); }
          100% { opacity: 0.7; box-shadow: 0 0 0 0 rgba(220,53,69,0); }
        }
        .live-badge { animation: pulseRed 1.5s infinite; }
      `}</style>
      
      <AlertNotification alert={activeAlert} lang={lang} />
      <NavigationBar onBack={() => navigateTo("home")} lang={lang} />
      
      {/* Real GPS */}
      <div style={{
        background: "#e8f4f8",
        borderRadius: "12px",
        padding: "0.5rem 1rem",
        marginBottom: "1rem",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem"
      }}>
        <i className="bi bi-check-circle-fill" style={{ color: "#28a745" }}></i>
        <span style={{ fontSize: "0.85rem", color: "#1f3b4c" }}>
          {lang === "en" 
            ? "📍 Using real GPS location from your device • Updates every 10 seconds"
            : "📍 يستخدم موقع GPS حقيقي من جهازك • تحديث كل 10 ثواني"}
        </span>
      </div>
      
      {/* Main Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isFamily ? "1.5fr 1fr" : "1fr",
        gap: "1.8rem"
      }}>
        {/* Map */}
        <div style={{
          background: "rgba(255,255,255,0.92)",
          borderRadius: "32px",
          boxShadow: "0 20px 35px -12px rgba(0,0,0,0.2)",
          overflow: "hidden"
        }}>
          <div style={{
            padding: "1.2rem 1.5rem",
            background: "white",
            borderBottom: "2px solid #eef2ff"
          }}>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#1f3b4c",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap"
            }}>
              <i className="bi bi-geo-alt-fill" style={{ color: "#2c7da0" }}></i>
              {isFamily 
                ? (lang === "en" ? "Real-time Patient Location" : "موقع المريض لحظياً")
                : (lang === "en" ? "Your Current Location" : "موقعك الحالي")
              }
              <span className="live-badge" style={{
                background: "#e63946",
                color: "white",
                fontSize: "0.7rem",
                fontWeight: 600,
                padding: "0.2rem 0.7rem",
                borderRadius: "40px"
              }}>LIVE</span>
            </h2>
          </div>
          
          <LocationMap 
            location={location} 
            safeZone={SAFE_ZONE}
            lang={lang}
            onMapReady={() => {}}
          />
          
          <div style={{
            padding: "0.8rem 1.2rem",
            background: "#f9fafc",
            fontSize: "0.8rem",
            color: "#3b5c6e",
            borderTop: "1px solid #e9edf2",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem"
          }}>
            <span><i className="bi bi-satellite"></i> GPS: {location?.accuracy ? `±${location.accuracy}m` : "Acquiring..."}</span>
            <span><i className="bi bi-wifi"></i> 12 satellites connected</span>
          </div>
        </div>
        
        {/* Right Panel */}
        {isFamily ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <LocationInfoCard 
              location={location}
              address={address}
              isInsideSafeZone={isInsideSafeZone}
              distance={distance}
              lastUpdate={lastUpdate}
              lang={lang}
            />
            <BraceletStatusCard 
              batteryLevel={batteryLevel}
              braceletRemoved={braceletRemoved}
              lang={lang}
            />
            
            {/* Alert History for Family */}
            {alertHistory.length > 0 && (
              <div style={{
                background: "white",
                borderRadius: "32px",
                padding: "1.5rem",
                boxShadow: "0 12px 28px -8px rgba(0,0,0,0.1)"
              }}>
                <div style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#1e3a4b",
                  borderLeft: "5px solid #9B8FD9",
                  paddingLeft: "1rem",
                  marginBottom: "1rem"
                }}>
                  <i className="bi bi-clock-history"></i> {lang === "en" ? "Alert History" : "سجل الإنذارات"}
                </div>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {alertHistory.slice(0, 5).map(alert => (
                    <div key={alert.id} style={{
                      padding: "0.6rem",
                      borderBottom: "1px solid #eee",
                      backgroundColor: alert.type === "emergency" ? "#fff3f0" : alert.type === "geofence" ? "#fff9e6" : "#e8f5e9",
                      borderRadius: "8px",
                      marginBottom: "0.5rem"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.3rem" }}>
                        <span style={{ fontSize: "0.85rem" }}>{alert.message}</span>
                        <span style={{ fontSize: "0.7rem", color: "#666" }}>{alert.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <LocationInfoCard 
              location={location}
              address={address}
              isInsideSafeZone={isInsideSafeZone}
              distance={distance}
              lastUpdate={lastUpdate}
              lang={lang}
            />
            <BraceletStatusCard 
              batteryLevel={batteryLevel}
              braceletRemoved={braceletRemoved}
              lang={lang}
            />
            <SOSButton onPress={handleSOS} lang={lang} />
          </div>
        )}
      </div>
      
      <RefreshButton onPress={handleRefreshLocation} lang={lang} />
      
      <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.75rem", color: "#5e7e97" }}>
        <i className="bi bi-shield-lock"></i> 
        {lang === "en" 
          ? "Secure GPS tracking • Powered by Zekra monitoring system"
          : "تتبع GPS آمن • يعمل بنظام مراقبة ذكرى"}
>>>>>>> 1dd3215f20874b316df7171a46cb2c59425abf3d
      </div>

      {/* Map */}
      <div style={{ height: "500px", width: "100%" }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >

          <ChangeView center={position} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position}>
            <Popup>
              {lang === "en" ? "Selected Location" : "الموقع المحدد"}
            </Popup>
          </Marker>

        </MapContainer>
      </div>

    </div>
  );
}

export default GPS;