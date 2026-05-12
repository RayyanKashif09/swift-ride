import L from 'leaflet';
import { useEffect, useRef } from 'react';

const pinIcon = new L.DivIcon({
  className: 'map-pin',
  html: '<span></span>',
  iconSize: [26, 34],
  iconAnchor: [13, 34],
});

export default function TripMap({ pickup, dropoff, driver, label = 'Live Route', className = '' }) {
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
    if (pickup?.lat && pickup?.lng) {
      const pt = [pickup.lat, pickup.lng];
      points.push(pt);
      L.marker(pt, { icon: pinIcon }).addTo(overlay).bindPopup('Pickup');
    }
    if (dropoff?.lat && dropoff?.lng) {
      const pt = [dropoff.lat, dropoff.lng];
      points.push(pt);
      L.marker(pt, { icon: pinIcon }).addTo(overlay).bindPopup('Drop-off');
    }
    if (driver?.lat && driver?.lng) {
      const pt = [driver.lat, driver.lng];
      points.push(pt);
      L.circleMarker(pt, { radius: 9, color: '#141210', fillColor: '#141210', fillOpacity: 0.9 })
        .addTo(overlay).bindPopup('Driver');
    }
    if (points.length > 1) {
      L.polyline(points, { color: '#141210', weight: 3, dashArray: '8 6' }).addTo(overlay);
      map.fitBounds(points, { padding: [40, 40] });
    }
  }, [pickup, dropoff, driver]);

  const wrapperCls = className || 'relative min-h-[400px] rounded-2xl overflow-hidden border border-black/[0.08]';

  return (
    <div className={wrapperCls} style={{ background: '#F4F4F4' }}>
      {label && (
        <div className="absolute top-4 left-4 z-[500] rounded-xl border border-black/[0.08] bg-white/92 backdrop-blur shadow-soft px-3 py-2">
          <div className="text-[12px] font-semibold text-ink-950">{label}</div>
          <div className="text-[11px] text-ink-500">{driver ? 'Driver signal active' : 'Route preview'}</div>
        </div>
      )}
      <div ref={nodeRef} className="w-full h-full min-h-[inherit]" style={{ minHeight: 'inherit' }}/>
    </div>
  );
}
