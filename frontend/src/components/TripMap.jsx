import L from 'leaflet';
import { useEffect, useRef } from 'react';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function TripMap({ pickup, dropoff, driver }) {
  const mapRef = useRef(null);
  const nodeRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!nodeRef.current || mapRef.current) return;
    mapRef.current = L.map(nodeRef.current).setView([31.5204, 74.3587], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);
    overlayRef.current = L.layerGroup().addTo(mapRef.current);
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const overlay = overlayRef.current;
    if (!map || !overlay) return;
    overlay.clearLayers();
    const points = [];
    if (pickup) {
      const point = [pickup.lat, pickup.lng];
      points.push(point);
      L.marker(point, { icon }).addTo(overlay).bindPopup('Pickup');
    }
    if (dropoff) {
      const point = [dropoff.lat, dropoff.lng];
      points.push(point);
      L.marker(point, { icon }).addTo(overlay).bindPopup('Drop-off');
    }
    if (driver) {
      const point = [driver.lat, driver.lng];
      points.push(point);
      L.circleMarker(point, { radius: 9, color: '#0f766e', fillColor: '#14b8a6', fillOpacity: 0.9 })
        .addTo(overlay)
        .bindPopup('Driver');
    }
    if (points.length > 1) {
      L.polyline(points, { color: '#e11d48', weight: 4 }).addTo(overlay);
      map.fitBounds(points, { padding: [35, 35] });
    }
  }, [pickup, dropoff, driver]);

  return <div className="map-panel" ref={nodeRef} />;
}
