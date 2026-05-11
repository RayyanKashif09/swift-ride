import { BarChart3, Car, DollarSign, Route, SlidersHorizontal, UsersRound } from 'lucide-react';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Layout from '../components/Layout.jsx';
import StatCard from '../components/StatCard.jsx';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip);

export default function AdminDashboard() {
  const [drivers, setDrivers] = useState([]);
  const [fares, setFares] = useState([]);
  const [report, setReport] = useState({});

  async function load() {
    const [driverResponse, fareResponse, reportResponse] = await Promise.all([
      api.get('/drivers'),
      api.get('/fares'),
      api.get('/reports/summary'),
    ]);
    setDrivers(driverResponse.data);
    setFares(fareResponse.data);
    setReport(reportResponse.data);
  }

  useEffect(() => { load(); }, []);

  async function toggleDriver(driver) {
    await api.put(`/drivers/${driver.id}/availability?available=${!driver.available}`);
    await load();
  }

  async function saveFare(fare) {
    await api.put(`/fares/${fare.id}`, fare);
    await load();
  }

  return (
    <Layout title="Admin Dashboard" subtitle="Manage drivers, fares and platform reports.">
      <section className="stats-grid">
        <StatCard label="Users" value={report.users || 0} icon={UsersRound} />
        <StatCard label="Drivers" value={report.drivers || 0} tone="highlight" icon={Car} />
        <StatCard label="Revenue" value={`Rs ${(report.revenue || 0).toFixed?.(0) || 0}`} tone="accent" icon={DollarSign} />
        <StatCard label="Trips" value={report.trips || 0} icon={Route} />
      </section>

      <section className="chart-grid">
        <div className="panel">
          <div className="panel-title"><BarChart3 size={19} /><h2>Trip report</h2></div>
          <Bar
            data={{
              labels: ['Requested', 'Completed'],
              datasets: [{ data: [report.requestedTrips || 0, report.completedTrips || 0], backgroundColor: ['#050505', '#b8b8b8'] }],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
        <div className="panel">
          <div className="panel-title"><BarChart3 size={19} /><h2>Revenue mix</h2></div>
          <Doughnut
            data={{
              labels: ['Revenue', 'Open demand'],
              datasets: [{ data: [report.revenue || 1, (report.requestedTrips || 0) * 250 + 1], backgroundColor: ['#050505', '#d8d8d8'] }],
            }}
          />
        </div>
      </section>

      <section className="workspace-grid">
        <div className="panel">
          <div className="panel-title"><Car size={19} /><h2>Manage drivers</h2></div>
          <div className="request-list">
            {drivers.map((driver) => (
              <div className="request-row" key={driver.id}>
                <div>
                  <b>{driver.user?.name}</b>
                  <span>{driver.licenseNumber} • {driver.available ? 'Available' : 'Busy'} • Rating {driver.ratingAverage?.toFixed(1)}</span>
                </div>
                <button className="ghost-button table-button" onClick={() => toggleDriver(driver)}>
                  {driver.available ? 'Set busy' : 'Set available'}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-title"><SlidersHorizontal size={19} /><h2>Manage fares</h2></div>
          <div className="fare-list">
            {fares.map((fare) => (
              <FareEditor key={fare.id} fare={fare} onSave={saveFare} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function FareEditor({ fare, onSave }) {
  const [draft, setDraft] = useState(fare);
  return (
    <div className="fare-row">
      <input value={draft.vehicleType} onChange={(e) => setDraft({ ...draft, vehicleType: e.target.value })} />
      <input type="number" value={draft.baseFare} onChange={(e) => setDraft({ ...draft, baseFare: Number(e.target.value) })} />
      <input type="number" value={draft.perKmRate} onChange={(e) => setDraft({ ...draft, perKmRate: Number(e.target.value) })} />
      <input type="number" value={draft.perMinuteRate} onChange={(e) => setDraft({ ...draft, perMinuteRate: Number(e.target.value) })} />
      <button className="primary-button small" onClick={() => onSave(draft)}>Save</button>
    </div>
  );
}
