import { Banknote, CheckCircle2, Gauge, ListChecks, MapPinned, Route, Star, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, getSession } from '../api/client';
import Layout from '../components/Layout.jsx';
import StatCard from '../components/StatCard.jsx';
import TripMap from '../components/TripMap.jsx';

export default function DriverDashboard() {
  const user = getSession();
  const [driver, setDriver] = useState(null);
  const [requests, setRequests] = useState([]);
  const [trips, setTrips] = useState([]);

  async function load() {
    const driverResponse = await api.get(`/drivers/by-user/${user.id}`);
    const currentDriver = driverResponse.data;
    setDriver(currentDriver);
    const [requestResponse, tripResponse] = await Promise.all([
      api.get('/trips/requested'),
      api.get(`/trips/driver/${currentDriver.id}`),
    ]);
    setRequests(requestResponse.data);
    setTrips(tripResponse.data);
  }

  useEffect(() => { load(); }, []);

  async function accept(tripId) {
    await api.put(`/trips/${tripId}/accept/${driver.id}`);
    await load();
  }

  async function complete(tripId) {
    await api.put(`/trips/${tripId}/complete`);
    await load();
  }

  const completed = trips.filter((trip) => trip.status === 'COMPLETED');
  const earnings = completed.reduce((sum, trip) => sum + trip.fare, 0);
  const activeTrip = trips.find((trip) => trip.status === 'ACCEPTED');

  return (
    <Layout title="Driver Dashboard" subtitle="Accept requests, complete rides and view earnings.">
      <section className="stats-grid">
        <StatCard label="Available" value={driver?.available ? 'Online' : 'Busy'} tone="badge" icon={CheckCircle2} />
        <StatCard label="Rating" value={driver?.ratingAverage?.toFixed?.(1) || '5.0'} tone="highlight" icon={Star} meta="Average score" />
        <StatCard label="Earnings" value={`Rs ${earnings.toFixed(0)}`} tone="accent" icon={Banknote} meta={`${completed.length} completed trips`} />
      </section>

      <section className="workspace-grid">
        <div className="panel">
          <div className="panel-title"><ListChecks size={19} /><h2>Ride requests</h2></div>
          <div className="request-list">
            {requests.length === 0 && <p className="muted">No pending ride requests.</p>}
            {requests.map((trip) => (
              <div className="request-row" key={trip.id}>
                <div>
                  <b>{trip.pickupAddress}</b>
                  <span>{trip.dropoffAddress} • Rs {trip.fare?.toFixed(0)}</span>
                </div>
                <button className="primary-button small" onClick={() => accept(trip.id)}>Accept</button>
              </div>
            ))}
          </div>
        </div>
        <TripMap
          label="Live Driver Location"
          pickup={activeTrip ? { lat: activeTrip.pickupLat, lng: activeTrip.pickupLng } : null}
          dropoff={activeTrip ? { lat: activeTrip.dropoffLat, lng: activeTrip.dropoffLng } : null}
          driver={driver ? { lat: driver.currentLat, lng: driver.currentLng } : null}
        />
      </section>

      <section className="panel">
        <div className="panel-title"><Gauge size={19} /><h2>Assigned trips</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Rider</th><th>Route</th><th className="align-right">Fare</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td>#{trip.id}</td>
                  <td><span className="cell-with-icon"><UserRound size={16} /> {trip.rider?.name}</span></td>
                  <td>
                    <span className="route-cell"><Route size={16} /> <span>{trip.pickupAddress}<small>{trip.dropoffAddress}</small></span></span>
                  </td>
                  <td className="fare-cell">Rs {trip.fare?.toFixed(0)}</td>
                  <td><span className={`pill ${trip.status.toLowerCase()}`}>{trip.status}</span></td>
                  <td>{trip.status === 'ACCEPTED' && <button className="ghost-button table-button" onClick={() => complete(trip.id)}><CheckCircle2 size={16} /> Complete</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel compact-panel">
        <div className="panel-title"><MapPinned size={19} /><h2>Earnings dashboard</h2></div>
        <p className="earnings-line">Completed trips: <b>{completed.length}</b> • Total earnings: <b>Rs {earnings.toFixed(0)}</b></p>
      </section>
    </Layout>
  );
}
