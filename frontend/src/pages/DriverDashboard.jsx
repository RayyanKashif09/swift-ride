import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getSession } from '../api/client';
import TripMap from '../components/TripMap.jsx';
import {
  Icons, Avatar, Pill, Button, Card, SectionLabel,
  Sparkline, Sidebar, StatusBadge, cn
} from '../components/ui/UI.jsx';

export default function DriverDashboard() {
  const user = getSession();
  const navigate = useNavigate();
  const [active, setActive] = useState('home');
  const [driver, setDriver] = useState(null);
  const [requests, setRequests] = useState([]);
  const [trips, setTrips] = useState([]);

  async function load() {
    const { data: d } = await api.get(`/drivers/by-user/${user.id}`);
    setDriver(d);
    const [reqRes, tripRes] = await Promise.all([
      api.get('/trips/requested'),
      api.get(`/trips/driver/${d.id}`),
    ]);
    setRequests(reqRes.data);
    setTrips(tripRes.data);
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

  const completed = trips.filter(t => t.status === 'COMPLETED');
  const earnings = completed.reduce((s, t) => s + (t.fare || 0), 0);
  const activeTrip = trips.find(t => t.status === 'ACCEPTED');

  const navItems = [
    { key: 'home',     label: 'Home',        icon: Icons.Home },
    { key: 'requests', label: 'Requests',    icon: Icons.ListChecks, badge: requests.length || null },
    { key: 'trips',    label: 'My Trips',    icon: Icons.Route },
    { key: 'earnings', label: 'Earnings',    icon: Icons.Banknote },
    { key: 'settings', label: 'Settings',   icon: Icons.Settings },
  ].filter(i => i.badge !== null || true).map(i => ({...i, badge: i.badge ? String(i.badge) : undefined}));

  return (
    <div className="bg-ink-50 min-h-screen flex">
      <Sidebar
        items={navItems}
        active={active}
        onSelect={setActive}
        label="Driver"
        footer={
          <div className="p-3 border-t border-black/[0.08]">
            <div className={cn(
              'rounded-xl p-4 relative overflow-hidden',
              driver?.available ? 'bg-ink-950 text-white' : 'bg-ink-100'
            )}>
              {driver?.available && <div className="absolute inset-0 bg-grid-dark opacity-50"/>}
              <div className="relative">
                <div className={cn('label-caps', driver?.available ? 'text-ink-400' : 'text-ink-500')}>
                  Status
                </div>
                <div className="mt-2 text-[14px] font-semibold flex items-center gap-2">
                  <span className={cn('w-2 h-2 rounded-full', driver?.available ? 'bg-green-400 animate-pulse' : 'bg-ink-400')}/>
                  {driver?.available ? 'Online' : 'Offline'}
                </div>
                <div className={cn('mt-1 text-[11px] tabular', driver?.available ? 'text-ink-400' : 'text-ink-500')}>
                  Rating: {driver?.ratingAverage?.toFixed(1) || '5.0'} ★
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
            <div className="label-caps text-ink-500">Driver · {driver?.available ? 'Online' : 'Offline'}</div>
            <div className="text-[15px] font-semibold text-ink-950 leading-tight">
              {user?.name || 'Driver Dashboard'}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="h-10 w-10 rounded-xl border border-black/[0.08] flex items-center justify-center text-ink-700 hover:border-ink-950 lift-hover relative">
              <Icons.Bell size={16}/>
              {requests.length > 0 && (
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
              <Avatar name={user?.name || 'D'} size={26}/>
              <div className="hidden sm:block leading-tight">
                <div className="text-[12.5px] font-semibold">{user?.name}</div>
                <div className="text-[10px] text-ink-500">{driver?.vehicleModel || 'Swift Driver'}</div>
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
                  {requests.length > 0 ? `${requests.length} new request${requests.length > 1 ? 's' : ''} nearby` : 'All clear, ready to drive.'}
                </h1>
              </div>
              <Pill dot>{driver?.available ? 'Online' : 'Offline'}</Pill>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="p-5 lift-hover">
                <div className="label-caps text-ink-500">Status</div>
                <div className="mt-3 display text-[28px] font-bold leading-none">{driver?.available ? 'Online' : 'Offline'}</div>
                <div className="mt-2 text-[12px] text-ink-500">{trips.length} trips total</div>
              </Card>
              <Card className="p-5 lift-hover">
                <div className="label-caps text-ink-500">Rating</div>
                <div className="mt-3 display text-[28px] font-bold leading-none tabular">{driver?.ratingAverage?.toFixed(1) || '5.0'}</div>
                <div className="mt-2 text-[12px] text-ink-500 flex items-center gap-1"><Icons.Star size={11}/> Average score</div>
              </Card>
              <Card className="p-5 lift-hover">
                <div className="label-caps text-ink-500">Earnings</div>
                <div className="mt-3 display text-[28px] font-bold leading-none tabular">Rs {earnings.toFixed(0)}</div>
                <div className="mt-2 text-[12px] text-ink-500">{completed.length} completed</div>
              </Card>
              <Card className="p-5 lift-hover">
                <div className="label-caps text-ink-500">Vehicle</div>
                <div className="mt-3 display text-[28px] font-bold leading-none truncate">{driver?.vehicleModel?.split(' ')[0] || '—'}</div>
                <div className="mt-2 text-[12px] text-ink-500 tabular">{driver?.licensePlate || '—'}</div>
              </Card>
            </div>

            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

              {/* Left column */}
              <div className="space-y-5">

                {/* Active trip map */}
                {activeTrip && (
                  <Card className="overflow-hidden">
                    <div className="grid lg:grid-cols-[1fr_280px]">
                      <div className="relative min-h-[300px]">
                        <TripMap
                          className="absolute inset-0 w-full h-full rounded-none"
                          label={null}
                          pickup={{ lat: activeTrip.pickupLat, lng: activeTrip.pickupLng }}
                          dropoff={{ lat: activeTrip.dropoffLat, lng: activeTrip.dropoffLng }}
                          driver={{ lat: driver?.currentLat, lng: driver?.currentLng }}
                        />
                        <div className="relative p-4 h-full flex flex-col">
                          <Pill dot className="self-end bg-white/90 backdrop-blur">Active trip</Pill>
                        </div>
                      </div>
                      <div className="p-5 border-t lg:border-t-0 lg:border-l border-black/[0.08] flex flex-col gap-3">
                        <div className="label-caps text-ink-500">Active trip #{activeTrip.id}</div>
                        <div className="relative pl-5">
                          <div className="absolute left-1.5 top-3 bottom-3 w-px bg-ink-200"/>
                          <div className="relative mb-4">
                            <span className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-ink-950 ring-2 ring-ink-50"/>
                            <div className="label-caps text-ink-500 text-[10px]">Pickup</div>
                            <div className="text-[13px] font-semibold mt-0.5">{activeTrip.pickupAddress}</div>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-5 top-1 w-3 h-3 bg-ink-950"/>
                            <div className="label-caps text-ink-500 text-[10px]">Dropoff</div>
                            <div className="text-[13px] font-semibold mt-0.5">{activeTrip.dropoffAddress}</div>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-black/[0.08] grid grid-cols-2 gap-2 tabular">
                          <div>
                            <div className="text-[16px] font-bold">{activeTrip.distanceKm} km</div>
                            <div className="text-[10px] text-ink-500 uppercase tracking-wider mt-1">Distance</div>
                          </div>
                          <div>
                            <div className="text-[16px] font-bold">Rs {activeTrip.fare?.toFixed(0)}</div>
                            <div className="text-[10px] text-ink-500 uppercase tracking-wider mt-1">Fare</div>
                          </div>
                        </div>
                        <Button variant="primary" className="w-full" onClick={() => complete(activeTrip.id)}
                          iconRight={<Icons.Check size={14}/>}>
                          Complete trip
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Trips table */}
                <Card>
                  <div className="flex items-center justify-between p-5 border-b border-black/[0.08]">
                    <div>
                      <div className="label-caps text-ink-500">Assigned trips</div>
                      <div className="text-[15px] font-semibold text-ink-950 mt-0.5">{trips.length} total</div>
                    </div>
                  </div>
                  {trips.length === 0 ? (
                    <div className="p-10 text-center text-ink-500 text-[14px]">No trips assigned yet.</div>
                  ) : (
                    <ul className="divide-y divide-black/[0.06]">
                      {trips.map(t => (
                        <li key={t.id} className="px-5 py-4 flex items-center gap-4 hover:bg-ink-50 group">
                          <div className="w-10 h-10 rounded-xl border border-black/[0.08] flex items-center justify-center text-ink-700 group-hover:bg-ink-950 group-hover:text-white transition-colors shrink-0">
                            <Icons.Car size={14}/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-[14px] font-semibold text-ink-950">
                              <span className="truncate">{t.pickupAddress}</span>
                              <Icons.ArrowRight size={12} className="text-ink-400 shrink-0"/>
                              <span className="truncate">{t.dropoffAddress}</span>
                            </div>
                            <div className="text-[11.5px] text-ink-500 tabular mt-0.5">
                              #{t.id} · {t.rider?.name || 'Rider'} · {t.distanceKm} km
                            </div>
                          </div>
                          <div className="text-right shrink-0 space-y-1">
                            <div className="text-[14px] font-bold tabular">Rs {t.fare?.toFixed(0)}</div>
                            <StatusBadge status={t.status}/>
                          </div>
                          {t.status === 'ACCEPTED' && (
                            <button
                              onClick={() => complete(t.id)}
                              className="h-8 px-3 rounded-lg border border-black/[0.08] text-[12px] font-medium hover:bg-ink-950 hover:text-white hover:border-ink-950 inline-flex items-center gap-1.5 ml-2 shrink-0"
                            >
                              <Icons.Check size={12}/> Done
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </div>

              {/* Right column */}
              <div className="space-y-5">

                {/* Ride requests */}
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="label-caps text-ink-500">Ride requests</div>
                    {requests.length > 0 && <Pill dot>{requests.length} new</Pill>}
                  </div>
                  {requests.length === 0 ? (
                    <div className="text-center py-6 text-ink-500 text-[13px]">
                      <Icons.Car size={24} className="mx-auto mb-2 opacity-30"/>
                      No pending requests
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {requests.map(req => (
                        <div key={req.id} className="rounded-xl border border-black/[0.08] p-4 hover:border-ink-950 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-[13.5px] font-semibold text-ink-950 truncate">{req.pickupAddress}</div>
                              <div className="text-[12px] text-ink-500 truncate mt-0.5">{req.dropoffAddress}</div>
                              <div className="mt-2 flex items-center gap-3 text-[12px] text-ink-700 tabular">
                                <span>{req.distanceKm} km</span>
                                <span>·</span>
                                <span className="font-semibold">Rs {req.fare?.toFixed(0)}</span>
                              </div>
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => accept(req.id)}
                              iconRight={<Icons.Check size={13}/>}
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Earnings summary */}
                <Card className="p-5 bg-ink-950 text-white border-ink-950 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-dark opacity-60 pointer-events-none"/>
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="label-caps text-ink-400">Earnings</div>
                      <Icons.Banknote size={16} className="text-ink-300"/>
                    </div>
                    <div className="mt-4 display text-[34px] font-bold tabular leading-none tracking-tightest">
                      Rs {earnings.toFixed(0)}
                    </div>
                    <div className="mt-2 text-[12px] text-ink-400">{completed.length} completed trips</div>
                    <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 tabular">
                      <div>
                        <div className="text-[16px] font-bold leading-none">{trips.length}</div>
                        <div className="text-[10.5px] text-ink-400 mt-1 uppercase tracking-wider">Total trips</div>
                      </div>
                      <div>
                        <div className="text-[16px] font-bold leading-none flex items-center gap-1">
                          {driver?.ratingAverage?.toFixed(1) || '5.0'} <Icons.Star size={12} className="text-ink-400"/>
                        </div>
                        <div className="text-[10.5px] text-ink-400 mt-1 uppercase tracking-wider">Avg rating</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Safety */}
                <Card className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-ink-950 text-white flex items-center justify-center">
                      <Icons.Headset size={16}/>
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold">24/7 support</div>
                      <div className="text-[11px] text-ink-500">Driver helpline available anytime</div>
                    </div>
                  </div>
                  <Button variant="outline" size="md" className="w-full" iconRight={<Icons.ArrowRight/>}>
                    Contact support
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
