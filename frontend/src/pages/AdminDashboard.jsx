import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getSession } from '../api/client';
import {
  Icons, Avatar, Pill, Button, Card, SectionLabel,
  Sparkline, Sidebar, StatusBadge, cn
} from '../components/ui/UI.jsx';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip);

const CHART_OPTS = { responsive: true, plugins: { legend: { display: false } } };

export default function AdminDashboard() {
  const user = getSession();
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');
  const [drivers, setDrivers] = useState([]);
  const [fares, setFares] = useState([]);
  const [report, setReport] = useState({});

  async function load() {
    const [driverRes, fareRes, reportRes] = await Promise.all([
      api.get('/drivers'),
      api.get('/fares'),
      api.get('/reports/summary'),
    ]);
    setDrivers(driverRes.data);
    setFares(fareRes.data);
    setReport(reportRes.data);
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

  const navItems = [
    { key: 'overview',  label: 'Overview',  icon: Icons.Home },
    { key: 'rides',     label: 'Rides',     icon: Icons.Route },
    { key: 'drivers',   label: 'Drivers',   icon: Icons.Car },
    { key: 'fares',     label: 'Fares',     icon: Icons.Tag },
    { key: 'users',     label: 'Users',     icon: Icons.Users },
    { key: 'settings',  label: 'Settings',  icon: Icons.Settings },
  ];

  const onlineDrivers = drivers.filter(d => d.available).length;

  return (
    <div className="bg-ink-50 min-h-screen flex">
      <Sidebar
        items={navItems}
        active={active}
        onSelect={setActive}
        label="Admin"
        footer={
          <div className="p-3 border-t border-black/[0.08]">
            <div className="rounded-xl bg-ink-950 text-white p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-dark opacity-50"/>
              <div className="relative">
                <div className="label-caps text-ink-400">System status</div>
                <div className="mt-2 text-[14px] font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/> All systems normal
                </div>
                <div className="mt-1 text-[11px] text-ink-400 tabular">
                  {onlineDrivers} drivers online
                </div>
              </div>
            </div>
          </div>
        }
      />

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="h-16 border-b border-black/[0.08] bg-white flex items-center px-6 lg:px-8 gap-4 shrink-0">
          <div>
            <div className="label-caps text-ink-500">Operations · live</div>
            <div className="text-[15px] font-semibold text-ink-950 leading-tight">Platform Overview</div>
          </div>
          <div className="hidden md:flex ml-6 items-center gap-1 rounded-full p-1 bg-ink-100">
            {['Today', '7 days', '30 days'].map((t,i) => (
              <button key={t} className={cn('h-8 px-3 text-[12px] font-medium rounded-full tab-pill',
                i === 0 ? 'bg-ink-950 text-white' : 'text-ink-600 hover:text-ink-950')}>
                {t}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="h-10 px-3 rounded-xl border border-black/[0.08] flex items-center gap-2 text-[12.5px] font-medium hover:border-ink-950 lift-hover">
              <Icons.Filter size={13}/> Filters
            </button>
            <button className="h-10 px-3 rounded-xl bg-ink-950 text-white flex items-center gap-2 text-[12.5px] font-medium btn-press">
              <Icons.Receipt size={13}/> Export
            </button>
            <button
              onClick={() => { localStorage.clear(); navigate('/'); }}
              className="h-10 w-10 rounded-xl border border-black/[0.08] flex items-center justify-center text-ink-700 hover:border-ink-950 lift-hover"
              title="Sign out"
            >
              <Icons.LogOut size={15}/>
            </button>
            <div className="h-10 pl-2 pr-3 rounded-xl border border-black/[0.08] flex items-center gap-2 hover:border-ink-950 cursor-pointer">
              <Avatar name={user?.name || 'A'} size={26}/>
              <div className="hidden sm:block leading-tight">
                <div className="text-[12.5px] font-semibold">{user?.name || 'Admin'}</div>
                <div className="text-[10px] text-ink-500">Ops Manager</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 page-in scrollbar-thin">
          <div className="max-w-[1440px] mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
              <div>
                <SectionLabel>Operations</SectionLabel>
                <h1 className="display mt-3 text-ink-950 font-bold text-[32px] md:text-[40px] leading-[1.0] tracking-tightest">
                  Today, at a glance.
                </h1>
              </div>
              <Pill dot>Live data</Pill>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total users',    value: report.users || 0,   icon: Icons.Users,     spark: [5,6,5,7,8,6,8,9,10,9,11,12] },
                { label: 'Active drivers', value: `${onlineDrivers}/${report.drivers || 0}`, icon: Icons.Car, spark: [3,4,3,5,4,6,5,7,6,8,7,9] },
                { label: 'Revenue (Rs)',   value: `${(report.revenue || 0).toFixed?.(0) || 0}`, icon: Icons.DollarSign, spark: [10,12,11,14,13,16,15,18,17,21,20,24] },
                { label: 'Total trips',    value: report.trips || 0,    icon: Icons.Route,     spark: [8,9,8,10,11,9,12,11,13,12,14,15] },
              ].map((s,i) => (
                <Card key={i} className="p-5 lift-hover">
                  <div className="flex items-start justify-between">
                    <div className="label-caps text-ink-500">{s.label}</div>
                    <s.icon size={14} className="text-ink-400"/>
                  </div>
                  <div className="mt-3 display text-[34px] font-bold tabular leading-none tracking-tightest">{s.value}</div>
                  <Sparkline data={s.spark} className="w-full h-8 mt-3"/>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-5 mb-5">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <SectionLabel>Trip breakdown</SectionLabel>
                    <div className="mt-2 display text-[28px] font-bold text-ink-950 leading-none tracking-tightest tabular">
                      {report.trips || 0} <span className="text-ink-400 text-[18px] font-medium">total</span>
                    </div>
                  </div>
                  <Pill>{report.completedTrips || 0} done</Pill>
                </div>
                <Bar
                  data={{
                    labels: ['Requested', 'Completed'],
                    datasets: [{
                      data: [report.requestedTrips || 0, report.completedTrips || 0],
                      backgroundColor: ['#141210', 'rgba(0,0,0,0.15)'],
                      borderRadius: 8,
                    }],
                  }}
                  options={{...CHART_OPTS, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.05)' } } }}}
                />
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <SectionLabel>Revenue mix</SectionLabel>
                    <div className="mt-2 display text-[28px] font-bold text-ink-950 leading-none tracking-tightest tabular">
                      Rs {(report.revenue || 0).toFixed?.(0) || 0}
                    </div>
                  </div>
                </div>
                <div className="max-w-[240px] mx-auto">
                  <Doughnut
                    data={{
                      labels: ['Revenue', 'Open demand'],
                      datasets: [{
                        data: [report.revenue || 1, (report.requestedTrips || 0) * 250 + 1],
                        backgroundColor: ['#141210', 'rgba(0,0,0,0.1)'],
                        borderWidth: 0,
                      }],
                    }}
                  />
                </div>
              </Card>
            </div>

            {/* Drivers & Fares */}
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">

              {/* Drivers */}
              <Card className="overflow-hidden">
                <div className="p-5 border-b border-black/[0.08] flex items-center justify-between">
                  <div>
                    <div className="label-caps text-ink-500">Manage drivers</div>
                    <div className="text-[15px] font-semibold text-ink-950 mt-0.5">{drivers.length} registered</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-black/[0.08] bg-ink-50 hover:bg-white hover:border-ink-950 transition-colors cursor-text">
                      <Icons.Search size={14}/>
                      <input className="bg-transparent outline-none text-[13px] placeholder:text-ink-400 w-32" placeholder="Search driver…"/>
                    </div>
                  </div>
                </div>
                {drivers.length === 0 ? (
                  <div className="p-10 text-center text-ink-500 text-[14px]">No drivers found.</div>
                ) : (
                  <ul className="divide-y divide-black/[0.06]">
                    {drivers.map(d => (
                      <li key={d.id} className="px-5 py-4 flex items-center gap-4 hover:bg-ink-50 group">
                        <Avatar name={d.user?.name || '?'} size={36}/>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-semibold text-ink-950">{d.user?.name}</div>
                          <div className="text-[11.5px] text-ink-500 tabular mt-0.5 flex items-center gap-2">
                            <span>{d.licenseNumber}</span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1"><Icons.Star size={10}/>{d.ratingAverage?.toFixed(1) || '5.0'}</span>
                          </div>
                        </div>
                        <div className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full text-[11px] font-medium',
                          d.available ? 'bg-green-100 text-green-800' : 'bg-ink-100 text-ink-600'
                        )}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', d.available ? 'bg-green-500 animate-pulse' : 'bg-ink-400')}/>
                          {d.available ? 'Online' : 'Offline'}
                        </div>
                        <button
                          onClick={() => toggleDriver(d)}
                          className="h-8 px-3 rounded-lg border border-black/[0.08] text-[12px] font-medium hover:border-ink-950 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {d.available ? 'Set busy' : 'Set online'}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              {/* Fares */}
              <Card className="overflow-hidden">
                <div className="p-5 border-b border-black/[0.08]">
                  <div className="label-caps text-ink-500">Fare rates</div>
                  <div className="text-[15px] font-semibold text-ink-950 mt-0.5">{fares.length} vehicle types</div>
                </div>
                {fares.length === 0 ? (
                  <div className="p-10 text-center text-ink-500 text-[14px]">No fare data.</div>
                ) : (
                  <div className="p-5 space-y-3">
                    {fares.map(fare => (
                      <FareEditor key={fare.id} fare={fare} onSave={saveFare}/>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FareEditor({ fare, onSave }) {
  const [draft, setDraft] = useState(fare);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="rounded-xl border border-black/[0.08] p-4 hover:border-ink-950 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icons.Car size={14} className="text-ink-500"/>
          <input
            value={draft.vehicleType}
            onChange={e => setDraft({ ...draft, vehicleType: e.target.value })}
            className="text-[14px] font-semibold bg-transparent outline-none border-b border-transparent hover:border-ink-300 focus:border-ink-950 transition-colors"
          />
        </div>
        <button
          onClick={handleSave}
          className={cn(
            'h-7 px-3 rounded-lg text-[12px] font-medium inline-flex items-center gap-1.5 transition-all',
            saved
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-ink-950 text-white hover:bg-ink-1000'
          )}
        >
          {saved ? <><Icons.Check size={12}/> Saved</> : 'Save'}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Base fare', key: 'baseFare' },
          { label: '/ km',      key: 'perKmRate' },
          { label: '/ min',     key: 'perMinuteRate' },
        ].map(({ label, key }) => (
          <div key={key}>
            <div className="text-[10px] text-ink-500 mb-1 uppercase tracking-wider">{label}</div>
            <input
              type="number"
              value={draft[key]}
              onChange={e => setDraft({ ...draft, [key]: Number(e.target.value) })}
              className="w-full h-8 px-2 rounded-lg border border-black/[0.08] bg-ink-50 text-[13px] tabular outline-none focus:border-ink-950 hover:border-ink-400 transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
