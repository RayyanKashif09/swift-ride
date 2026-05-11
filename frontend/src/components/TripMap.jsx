import L from 'leaflet';
import { useEffect, useRef } from 'react';

const icon = new L.DivIcon({
  className: 'map-pin',
  html: '<span></span>',
  iconSize: [26, 34],
  iconAnchor: [13, 34],
});

export default function TripMap({ pickup, dropoff, driver, label = 'Live Driver Location' }) {
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
      L.circleMarker(point, { radius: 9, color: '#050505', fillColor: '#050505', fillOpacity: 0.9 })
        .addTo(overlay)
        .bindPopup('Driver');
    }
    if (points.length > 1) {
      L.polyline(points, { color: '#050505', weight: 4 }).addTo(overlay);
      map.fitBounds(points, { padding: [35, 35] });
    }
  }, [pickup, dropoff, driver]);

  return (
    <div className="map-panel">
      <div className="map-label">
        <b>{label}</b>
        <span>{driver ? 'Driver signal active' : 'Route preview'}</span>
      </div>
      <div className="map-canvas" ref={nodeRef} />
    </div>
  );
}
