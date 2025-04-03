import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const MapComponent = ({ address }) => {
  const [position, setPosition] = useState(null);
  const apiKey = "0606886f70834768825978f7d526ac4e";

  useEffect(() => {
    if (address) {
      const fetchCoordinates = async () => {
        try {
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
              address
            )}&key=${apiKey}`
          );
          const { results } = response.data;
          if (results.length > 0) {
            const { lat, lng } = results[0].geometry;
            setPosition([lat, lng]);
          }
        } catch (error) {
          console.error("Error fetching coordinates:", error);
        }
      };
      fetchCoordinates();
    }
  }, [address]);

  return (
    <div className="map-container" style={{ height: "400px", width: "100%" }}>
      {position ? (
        <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Đang tải bản đồ...</p>
      )}
    </div>
  );
};

export default MapComponent;
