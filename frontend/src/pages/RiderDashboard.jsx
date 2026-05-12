import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getSession } from '../api/client';
import TripMap from '../components/TripMap.jsx';
import {
  Icons, Avatar, Pill, Button, Card, SectionLabel,
  MonoMap, Sparkline, Sidebar, StatusBadge, cn
} from '../components/ui/UI.jsx';

const TIER_DATA = [
  { n: 'Swift',   d: '4 seats',    t: '3 min', active: true },
  { n: 'Comfort', d: 'Premium · 4', t: '5 min' },
  { n: 'XL',      d: 'Up to 6',    t: '7 min' },
];

export default function RiderDashboard() {
  const user = getSession();
  const navigate = useNavigate();
  const [active, setActive] = useState('home');
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({
    pickupAddress: 'Liberty Market, Lahore',
    dropoffAddress: 'Emporium Mall, Lahore',
    pickupLat: 31.5102, pickupLng: 74.3441,
    dropoffLat: 31.4676, dropoffLng: 74.2652,
    distanceKm: 9.2,
  });
  const [rating, setRating] = useState({ tripId: '', stars: 5, comment: 'Clean car and polite driver.' });

  async function loadTrips() {
    const { data } = await api.get(`/trips/rider/${user.id}`);
    setTrips(data);
  }

  useEffect(() => { loadTrips(); }, []);

  async function bookTrip(e) {
    e.preventDefault();
    await api.post('/trips', { ...form, riderId: user.id });
    await loadTrips();
  }

  async function rateTrip(e) {
    e.preventDefault();
    await api.post('/trips/rate', rating);
    setRating({ ...rating, tripId: '', comment: '' });
    await loadTrips();
  }

  const latest = trips[0];
  const completed = trips.filter(t => t.status === 'COMPLETED');
  const totalFare = completed.reduce((s, t) => s + (t.fare || 0), 0);

  const navItems = [
    { key: 'home',     label: 'Home',      icon: Icons.Home },
    { key: 'book',     label: 'Book Ride', icon: Icons.Plus, badge: 'New' },
    { key: 'trips',    label: 'Trips',     icon: Icons.Route },
    { key: 'wallet',   label: 'Wallet',    icon: Icons.Wallet },
    { key: 'settings', label: 'Settings',  icon: Icons.Settings },
  ];

  return (
    <div className="bg-ink-50 min-h-screen flex">
      <Sidebar
        items={navItems}
        active={active}
        onSelect={setActive}
        label="Rider"
        footer={
          <div className="p-3 border-t border-black/[0.08]">
            <div className="rounded-xl border border-black/[0.08] p-4 bg-ink-50">
              <div className="flex items-center gap-2">
                <Icons.Sparkle size={14}/>
                <div className="text-[12.5px] font-semibold">Try Swift+</div>
              </div>
              <p className="mt-1.5 text-[11.5px] text-ink-500 leading-relaxed">Locked fares, priority pickup, no booking fees.</p>
              <button className="mt-3 h-8 w-full rounded-lg bg-ink-950 text-white text-[12px] font-medium hover:bg-ink-1000 btn-press">
                Start free trial
              </button>
            </div>
          </div>
        }
      />

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="h-16 border-b border-black/[0.08] bg-white flex items-center px-6 lg:px-8 gap-4 shrink-0">
          <div>
            <div className="text-[12px] text-ink-500 tabular">
              {new Date().toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' })}
            </div>
            <div className="text-[15px] font-semibold text-ink-950 leading-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Rider'}
            </div>
          </div>
          <div className="hidden md:flex ml-8 flex-1 max-w-[360px] items-center gap-2 h-10 px-3 rounded-xl border border-black/[0.08] bg-ink-50 hover:bg-white hover:border-ink-950 transition-colors cursor-text">
            <Icons.Search size={15}/>
            <input className="flex-1 bg-transparent outline-none text-[13.5px] placeholder:text-ink-400" placeholder="Search trips, places…"/>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="h-10 w-10 rounded-xl border border-black/[0.08] flex items-center justify-center text-ink-700 hover:border-ink-950 lift-hover relative">
              <Icons.Bell size={16}/>
              {trips.some(t => t.status === 'ACCEPTED') && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-ink-950"/>
              )}
            </button>
            <button
              onClick={() => { localStorage.clear(); navigate('/'); }}
              className="h-10 w-10 rounded-xl border border-black/[0.08] flex items-center justify-center text-ink-700 hover:border-ink-950 lift-hover"
              title="Sign out"
            >
              <Icons.LogOut size={15}/>
            </button>
            <div className="h-10 pl-2 pr-3 rounded-xl border border-black/[0.08] flex items-center gap-2 hover:border-ink-950 cursor-pointer">
              <Avatar name={user?.name || 'R'} size={26}/>
              <div className="hidden sm:block leading-tight">
                <div className="text-[12.5px] font-semibold">{user?.name || 'Rider'}</div>
                <div className="text-[10px] text-ink-500">Swift Rider</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 page-in scrollbar-thin">
          <div className="max-w-[1320px] mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
              <div>
                <SectionLabel>Overview</SectionLabel>
                <h1 className="display mt-3 text-ink-950 font-bold text-[32px] md:text-[40px] leading-[1.0] tracking-tightest">
                  Where to today, {user?.name?.split(' ')[0] || 'Rider'}?
                </h1>
              </div>
              <Pill dot>Network active</Pill>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatMini label="Total trips" value={trips.length} spark={[2,3,2,4,5,3,4,5,6,4,5,7]}/>
              <StatMini label="Completed"   value={completed.length} spark={[1,2,1,3,2,4,3,4,5,3,4,6]}/>
              <StatMini label="Total spent" value={`Rs ${totalFare.toFixed(0)}`} spark={[10,14,12,18,15,20,17,22,19,25,22,28]}/>
              <StatMini label="Avg rating"  value="4.97 ★" spark={[5,5,5,4.8,5,5,4.9,5,5,4.9,5,5]}/>
            </div>

            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

              {/* Left column */}
              <div className="space-y-5">

                {/* Active trip card */}
                {latest && latest.status !== 'COMPLETED' && latest.status !== 'CANCELLED' && (
                  <Card className="overflow-hidden">
                    <div className="grid lg:grid-cols-[1fr_320px]">
                      <div className="relative min-h-[340px]">
                        <TripMap
                          className="absolute inset-0 w-full h-full rounded-none"
                          label={null}
                          pickup={{ lat: latest.pickupLat || form.pickupLat, lng: latest.pickupLng || form.pickupLng }}
                          dropoff={{ lat: latest.dropoffLat || form.dropoffLat, lng: latest.dropoffLng || form.dropoffLng }}
                          driver={latest.driver ? { lat: latest.driver.currentLat, lng: latest.driver.currentLng } : null}
                        />
                        <div className="relative p-5 h-full flex flex-col">
                          <div className="flex items-center justify-end">
                            <Pill dot className="bg-white/90 backdrop-blur">Active · {latest.status}</Pill>
                          </div>
                          <div className="mt-auto rounded-xl bg-white/95 backdrop-blur border border-black/[0.08] shadow-soft p-4 flex items-center gap-4">
                            <Avatar name={latest.driver?.user?.name || '?'} size={40}/>
                            <div className="flex-1 min-w-0">
                              <div className="text-[14px] font-semibold text-ink-950">
                                {latest.driver?.user?.name || 'Searching for driver…'}
                              </div>
                              <div className="text-[12px] text-ink-500 tabular truncate">
                                {latest.driver ? `${latest.driver.vehicleModel} · ${latest.driver.licensePlate} · ${latest.driver.ratingAverage?.toFixed(1)} ★` : 'Please wait…'}
                              </div>
                            </div>
                            {latest.driver && (
                              <button className="h-9 px-3 rounded-lg border border-black/[0.08] text-[12.5px] font-medium hover:border-ink-950 inline-flex items-center gap-1.5">
                                <Icons.Headset size={13}/> Call
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-6 border-t lg:border-t-0 lg:border-l border-black/[0.08] flex flex-col">
                        <div className="label-caps text-ink-500">Current trip</div>
                        <div className="mt-3">
                          <div className="display text-[38px] font-bold text-ink-950 leading-none tracking-tightest tabular">
                            {latest.status}
                          </div>
                          <div className="text-[12px] text-ink-500 mt-2">Trip #{latest.id}</div>
                        </div>
                        <div className="mt-6 relative pl-5">
                          <div className="absolute left-1.5 top-3 bottom-3 w-px bg-ink-200"/>
                          <div className="relative">
                            <span className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-ink-950 ring-2 ring-ink-50"/>
                            <div className="text-[11px] label-caps text-ink-500">Pickup</div>
                            <div className="text-[14px] font-semibold text-ink-950 mt-0.5">{latest.pickupAddress}</div>
                          </div>
                          <div className="relative mt-5">
                            <span className="absolute -left-5 top-1 w-3 h-3 bg-ink-950"/>
                            <div className="text-[11px] label-caps text-ink-500">Dropoff</div>
                            <div className="text-[14px] font-semibold text-ink-950 mt-0.5">{latest.dropoffAddress}</div>
                          </div>
                        </div>
                        <div className="mt-auto pt-6 grid grid-cols-2 gap-3 border-t border-black/[0.08] tabular">
                          <div>
                            <div className="text-[18px] font-bold leading-none">{latest.distanceKm} km</div>
                            <div className="text-[10px] text-ink-500 mt-1.5 uppercase tracking-wider">Distance</div>
                          </div>
                          <div>
                            <div className="text-[18px] font-bold leading-none">Rs {latest.fare?.toFixed(0) || '—'}</div>
                            <div className="text-[10px] text-ink-500 mt-1.5 uppercase tracking-wider">Fare</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Trips table */}
                <Card>
                  <div className="flex items-center justify-between p-5 border-b border-black/[0.08]">
                    <div>
                      <div className="label-caps text-ink-500">Recent trips</div>
                      <div className="text-[15px] font-semibold text-ink-950 mt-0.5">{trips.length} total</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="h-8 px-3 rounded-lg border border-black/[0.08] text-[12px] font-medium hover:border-ink-950 inline-flex items-center gap-1.5">
                        <Icons.Filter size={12}/> Filter
                      </button>
                      <button className="h-8 px-3 rounded-lg border border-black/[0.08] text-[12px] font-medium hover:border-ink-950 inline-flex items-center gap-1.5">
                        <Icons.Receipt size={12}/> Export
                      </button>
                    </div>
                  </div>
                  {trips.length === 0 ? (
                    <div className="p-10 text-center text-ink-500 text-[14px]">No trips yet. Book your first ride →</div>
                  ) : (
                    <ul className="divide-y divide-black/[0.06]">
                      {trips.map(t => (
                        <li key={t.id} className="px-5 py-4 flex items-center gap-4 hover:bg-ink-50 cursor-pointer group">
                          <div className="w-10 h-10 rounded-xl border border-black/[0.08] flex items-center justify-center text-ink-700 group-hover:bg-ink-950 group-hover:text-white transition-colors shrink-0">
                            <Icons.Car size={14}/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-[14px] font-semibold text-ink-950">
                              <span className="truncate">{t.pickupAddress}</span>
                              <Icons.ArrowRight size={12} className="text-ink-400 shrink-0"/>
                              <span className="truncate">{t.dropoffAddress}</span>
                            </div>
                            <div className="text-[11.5px] text-ink-500 tabular mt-0.5 flex items-center gap-2">
                              <span>#{t.id}</span>
                              {t.driver?.user?.name && <><span>·</span><span>{t.driver.user.name}</span></>}
                              {t.driver?.ratingAverage && <><span>·</span><span className="inline-flex items-center gap-1"><Icons.Star size={10}/>{t.driver.ratingAverage.toFixed(1)}</span></>}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[14px] font-bold tabular">Rs {t.fare?.toFixed(0) || '—'}</div>
                            <div className="mt-1"><StatusBadge status={t.status}/></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>

                {/* Rate driver */}
                {completed.length > 0 && (
                  <Card className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl border border-black/[0.08] flex items-center justify-center"><Icons.Star size={16}/></div>
                      <div>
                        <div className="text-[14px] font-semibold">Rate your driver</div>
                        <div className="text-[12px] text-ink-500">Rate a completed trip</div>
                      </div>
                    </div>
                    <form onSubmit={rateTrip} className="space-y-3">
                      <select
                        value={rating.tripId}
                        onChange={e => setRating({ ...rating, tripId: e.target.value })}
                        required
                        className="w-full h-10 px-3 rounded-xl border border-black/[0.08] bg-ink-50 text-[13.5px] outline-none hover:border-ink-950 focus:border-ink-950 transition-colors"
                      >
                        <option value="">Choose completed trip</option>
                        {completed.map(t => (
                          <option key={t.id} value={t.id}>Trip #{t.id} — {t.driver?.user?.name || 'Driver'}</option>
                        ))}
                      </select>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number" min="1" max="5"
                          value={rating.stars}
                          onChange={e => setRating({ ...rating, stars: Number(e.target.value) })}
                          placeholder="Stars (1-5)"
                          className="h-10 px-3 rounded-xl border border-black/[0.08] bg-ink-50 text-[13.5px] outline-none hover:border-ink-950 focus:border-ink-950 transition-colors"
                        />
                        <input
                          value={rating.comment}
                          onChange={e => setRating({ ...rating, comment: e.target.value })}
                          placeholder="Comment (optional)"
                          className="h-10 px-3 rounded-xl border border-black/[0.08] bg-ink-50 text-[13.5px] outline-none hover:border-ink-950 focus:border-ink-950 transition-colors"
                        />
                      </div>
                      <Button variant="primary" className="w-full">Submit rating</Button>
                    </form>
                  </Card>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Book ride card */}
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="label-caps text-ink-500">Book a ride</div>
                    <button className="text-[12px] text-ink-600 hover:text-ink-950 inline-flex items-center gap-1">
                      All options <Icons.ChevronRight size={12}/>
                    </button>
                  </div>
                  <form onSubmit={bookTrip} className="space-y-2.5">
                    <label className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-black/[0.08] bg-ink-50 hover:bg-white hover:border-ink-950 transition-colors cursor-text">
                      <span className="w-2.5 h-2.5 rounded-full bg-ink-950 ring-2 ring-ink-300"/>
                      <div className="flex-1 min-w-0">
                        <div className="label-caps text-ink-500">Pickup</div>
                        <input
                          value={form.pickupAddress}
                          onChange={e => setForm({ ...form, pickupAddress: e.target.value })}
                          placeholder="Pickup address"
                          className="w-full bg-transparent outline-none text-[13.5px] font-semibold mt-0.5"
                        />
                      </div>
                    </label>
                    <label className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-black/[0.08] bg-ink-50 hover:bg-white hover:border-ink-950 transition-colors cursor-text">
                      <span className="w-2.5 h-2.5 bg-ink-950"/>
                      <div className="flex-1 min-w-0">
                        <div className="label-caps text-ink-500">Dropoff</div>
                        <input
                          value={form.dropoffAddress}
                          onChange={e => setForm({ ...form, dropoffAddress: e.target.value })}
                          placeholder="Where to?"
                          className="w-full bg-transparent outline-none text-[13.5px] font-semibold mt-0.5"
                        />
                      </div>
                    </label>

                    {/* Tier selector */}
                    <div className="space-y-1.5 pt-1">
                      {TIER_DATA.map(tier => (
                        <div key={tier.n} className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl border lift-hover text-left',
                          tier.active ? 'border-ink-950 bg-ink-50' : 'border-black/[0.08] bg-white hover:border-ink-950'
                        )}>
                          <div className="w-9 h-9 rounded-lg bg-ink-950 text-white flex items-center justify-center">
                            <Icons.Car size={15}/>
                          </div>
                          <div className="flex-1">
                            <div className="text-[13px] font-semibold text-ink-950">{tier.n}</div>
                            <div className="text-[11px] text-ink-500 tabular">{tier.d} · {tier.t}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Hidden coord fields */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        ['Pickup lat', 'pickupLat'], ['Pickup lng', 'pickupLng'],
                        ['Dropoff lat', 'dropoffLat'], ['Dropoff lng', 'dropoffLng'],
                      ].map(([ph, k]) => (
                        <input key={k} type="number" step="0.0001"
                          value={form[k]}
                          onChange={e => setForm({ ...form, [k]: Number(e.target.value) })}
                          placeholder={ph}
                          className="h-9 px-3 rounded-xl border border-black/[0.08] bg-ink-50 text-[12px] outline-none hover:border-ink-950 focus:border-ink-950 transition-colors"
                        />
                      ))}
                      <input type="number" step="0.1"
                        value={form.distanceKm}
                        onChange={e => setForm({ ...form, distanceKm: Number(e.target.value) })}
                        placeholder="Distance km"
                        className="h-9 px-3 rounded-xl border border-black/[0.08] bg-ink-50 text-[12px] outline-none hover:border-ink-950 focus:border-ink-950 transition-colors col-span-2"
                      />
                    </div>

                    <Button variant="primary" size="lg" className="w-full mt-2"
                      iconRight={<span className="arrow-pulse"><Icons.ArrowRight/></span>}>
                      Book ride
                    </Button>
                  </form>
                </Card>

                {/* Saved places */}
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="label-caps text-ink-500">Saved places</div>
                  </div>
                  <ul className="space-y-1">
                    {[
                      { icon: <Icons.Home size={14}/>, label: 'Home',   sub: 'Liberty Market' },
                      { icon: <Icons.Tag size={14}/>,  label: 'Office', sub: 'Gulberg III' },
                      { icon: <Icons.Plus size={14}/>, label: 'Add place', sub: '', muted: true },
                    ].map((p,i) => (
                      <li key={i}>
                        <button className={cn('w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-ink-50 text-left lift-hover', p.muted && 'text-ink-500')}>
                          <span className="w-8 h-8 rounded-lg border border-black/[0.08] flex items-center justify-center text-ink-700">{p.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13.5px] font-semibold">{p.label}</div>
                            {p.sub && <div className="text-[11px] text-ink-500 truncate">{p.sub}</div>}
                          </div>
                          <Icons.ChevronRight size={13} className="text-ink-400"/>
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Safety */}
                <Card className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-ink-950 text-white flex items-center justify-center">
                      <Icons.Headset size={16}/>
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold">24/7 safety desk</div>
                      <div className="text-[11px] text-ink-500">Reachable in under 12 seconds</div>
                    </div>
                  </div>
                  <Button variant="outline" size="md" className="w-full" iconRight={<Icons.ArrowRight/>}>
                    Open safety center
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatMini({ label, value, spark }) {
  return (
    <Card className="p-5 lift-hover">
      <div className="label-caps text-ink-500">{label}</div>
      <div className="mt-3 display text-[28px] font-bold tabular leading-none">{value}</div>
      {spark && <Sparkline data={spark} className="w-full h-8 mt-3"/>}
    </Card>
  );
}
