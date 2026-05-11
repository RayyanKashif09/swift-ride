import { Banknote, CheckCircle2, Navigation, RefreshCcw, Route, Star, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, getSession } from '../api/client';
import Layout from '../components/Layout.jsx';
import StatCard from '../components/StatCard.jsx';
import TripMap from '../components/TripMap.jsx';

const initialTrip = {
  pickupAddress: 'Liberty Market, Lahore',
  dropoffAddress: 'Emporium Mall, Lahore',
  pickupLat: 31.5102,
  pickupLng: 74.3441,
  dropoffLat: 31.4676,
  dropoffLng: 74.2652,
  distanceKm: 9.2,
};

export default function RiderDashboard() {
  const user = getSession();
  const [form, setForm] = useState(initialTrip);
  const [trips, setTrips] = useState([]);
  const [rating, setRating] = useState({ tripId: '', stars: 5, comment: 'Clean car and polite driver.' });

  async function loadTrips() {
    const { data } = await api.get(`/trips/rider/${user.id}`);
    setTrips(data);
  }

  useEffect(() => { loadTrips(); }, []);

  async function bookTrip(event) {
    event.preventDefault();
    await api.post('/trips', { ...form, riderId: user.id });
    await loadTrips();
  }

  async function rateTrip(event) {
    event.preventDefault();
    await api.post('/trips/rate', rating);
    setRating({ ...rating, tripId: '', comment: '' });
    await loadTrips();
  }

  const latest = trips[0];
  const completed = trips.filter((trip) => trip.status === 'COMPLETED');

  return (
    <Layout title="Rider Dashboard" subtitle="Book rides, track the route and rate completed trips.">
      <section className="stats-grid">
        <StatCard label="My Trips" value={trips.length} icon={Route} />
        <StatCard label="Completed" value={completed.length} tone="highlight" icon={CheckCircle2} />
        <StatCard label="Last Fare" value={`Rs ${latest?.fare?.toFixed?.(0) || 0}`} tone="accent" icon={Banknote} />
      </section>

      <section className="workspace-grid">
        <div className="panel">
          <div className="panel-title"><Navigation size={19} /><h2>Book ride</h2></div>
          <form className="form-grid" onSubmit={bookTrip}>
            <input value={form.pickupAddress} onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })} placeholder="Pickup address" />
            <input value={form.dropoffAddress} onChange={(e) => setForm({ ...form, dropoffAddress: e.target.value })} placeholder="Drop-off address" />
            <input type="number" step="0.0001" value={form.pickupLat} onChange={(e) => setForm({ ...form, pickupLat: Number(e.target.value) })} placeholder="Pickup latitude" />
            <input type="number" step="0.0001" value={form.pickupLng} onChange={(e) => setForm({ ...form, pickupLng: Number(e.target.value) })} placeholder="Pickup longitude" />
            <input type="number" step="0.0001" value={form.dropoffLat} onChange={(e) => setForm({ ...form, dropoffLat: Number(e.target.value) })} placeholder="Drop-off latitude" />
            <input type="number" step="0.0001" value={form.dropoffLng} onChange={(e) => setForm({ ...form, dropoffLng: Number(e.target.value) })} placeholder="Drop-off longitude" />
            <input type="number" step="0.1" value={form.distanceKm} onChange={(e) => setForm({ ...form, distanceKm: Number(e.target.value) })} placeholder="Distance km" />
            <button className="primary-button">Book now</button>
          </form>
        </div>
        <TripMap
          label="Current Route"
          pickup={{ lat: form.pickupLat, lng: form.pickupLng }}
          dropoff={{ lat: form.dropoffLat, lng: form.dropoffLng }}
          driver={latest?.driver ? { lat: latest.driver.currentLat, lng: latest.driver.currentLng } : null}
        />
      </section>

      <section className="panel">
        <div className="panel-title"><RefreshCcw size={19} /><h2>My trips</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Route</th><th>Driver</th><th className="align-right">Fare</th><th>Status</th></tr></thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td>#{trip.id}</td>
                  <td><span className="route-cell"><Route size={16} /> <span>{trip.pickupAddress}<small>{trip.dropoffAddress}</small></span></span></td>
                  <td><span className="cell-with-icon"><UserRound size={16} /> {trip.driver?.user?.name || 'Waiting'}</span></td>
                  <td className="fare-cell">Rs {trip.fare?.toFixed(0)}</td>
                  <td><span className={`pill ${trip.status.toLowerCase()}`}>{trip.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel compact-panel">
        <div className="panel-title"><Star size={19} /><h2>Rate driver</h2></div>
        <form className="inline-form" onSubmit={rateTrip}>
          <select value={rating.tripId} onChange={(e) => setRating({ ...rating, tripId: e.target.value })} required>
            <option value="">Choose completed trip</option>
            {completed.map((trip) => <option key={trip.id} value={trip.id}>Trip #{trip.id} - {trip.driver?.user?.name}</option>)}
          </select>
          <input type="number" min="1" max="5" value={rating.stars} onChange={(e) => setRating({ ...rating, stars: Number(e.target.value) })} />
          <input value={rating.comment} onChange={(e) => setRating({ ...rating, comment: e.target.value })} placeholder="Comment" />
          <button className="primary-button">Submit rating</button>
        </form>
      </section>
    </Layout>
  );
}
