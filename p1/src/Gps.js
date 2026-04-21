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