import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, saveSession } from '../api/client';
import { Icons, Button, cn } from '../components/ui/UI.jsx';

const roleOptions = [
  { label: 'Rider',  value: 'RIDER',  icon: Icons.User },
  { label: 'Driver', value: 'DRIVER', icon: Icons.Car },
  { label: 'Admin',  value: 'ADMIN',  icon: Icons.Shield },
];

const credentials = {
  ADMIN:  { email: 'admin@swiftride.com',  password: 'admin123' },
  RIDER:  { email: 'ahmed@gmail.com',      password: 'rider123' },
  DRIVER: { email: 'bilal@gmail.com',      password: 'driver123' },
};

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('RIDER');
  const [loginForm, setLoginForm] = useState(credentials.RIDER);
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function chooseRole(nextRole) {
    setRole(nextRole);
    if (mode === 'login') setLoginForm(credentials[nextRole]);
    setMessage('');
  }

  async function submitLogin(e) {
    e.preventDefault();
    setMessage(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', loginForm);
      saveSession(data);
      navigate(`/${data.role.toLowerCase()}`);
    } catch {
      setMessage('Invalid credentials or backend is not running.');
    } finally { setLoading(false); }
  }

  async function submitSignup(e) {
    e.preventDefault();
    setMessage(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', { ...signupForm, role });
      saveSession(data);
      navigate(`/${data.role.toLowerCase()}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not create account. Check the backend.');
    } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-ink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[960px] bg-white border border-black/[0.08] rounded-3xl shadow-lift overflow-hidden grid lg:grid-cols-[1fr_1fr]">

        {/* ── Form panel ── */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-10">
            <Icons.Logo size={24}/>
            <span className="font-bold tracking-tightest text-[18px]">Swift Ride</span>
          </div>

          {/* Headline */}
          <div className="mb-7">
            <h1 className="display font-bold text-ink-950 text-[32px] md:text-[38px] leading-[1.05] tracking-tightest">
              {mode === 'login' ? 'Welcome back.' : 'Create account.'}
            </h1>
            <p className="mt-2 text-[14px] text-ink-500 leading-relaxed">
              {mode === 'login'
                ? 'Sign in to book rides, manage dispatch, or keep every trip moving.'
                : 'Choose your account type and start using Swift Ride right away.'}
            </p>
          </div>

          {/* Mode tabs */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-ink-100 border border-black/[0.06] mb-7">
            {['login','signup'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setMessage(''); }}
                className={cn(
                  'flex-1 h-9 text-[13px] font-medium rounded-full tab-pill capitalize',
                  mode === m ? 'bg-ink-950 text-white' : 'text-ink-600 hover:text-ink-950'
                )}
              >
                {m === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* Role selector */}
          <div className="flex items-center gap-2 mb-5">
            <span className="label-caps text-ink-500">Account type</span>
            <div className="flex items-center gap-1.5 ml-2">
              {roleOptions.map(opt => {
                const Ic = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => chooseRole(opt.value)}
                    className={cn(
                      'h-9 px-3 rounded-xl inline-flex items-center gap-2 text-[13px] font-medium border tab-pill',
                      role === opt.value
                        ? 'bg-ink-950 text-white border-ink-950'
                        : 'text-ink-600 border-black/[0.08] hover:border-ink-950 bg-white'
                    )}
                  >
                    <Ic size={14}/>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {mode === 'login' ? (
            <form onSubmit={submitLogin} className="space-y-3">
              <AuthField
                label="Email" type="email" icon={<Icons.Mail size={15}/>}
                value={loginForm.email}
                onChange={v => setLoginForm({ ...loginForm, email: v })}
                placeholder="Email address"
              />
              <AuthField
                label="Password" type="password" icon={<Icons.KeyRound size={15}/>}
                value={loginForm.password}
                onChange={v => setLoginForm({ ...loginForm, password: v })}
                placeholder="Password"
              />
              {message && <ErrorMsg>{message}</ErrorMsg>}
              <Button variant="primary" size="lg" className="w-full mt-2" disabled={loading}
                iconRight={<span className="arrow-pulse"><Icons.ArrowRight/></span>}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          ) : (
            <form onSubmit={submitSignup} className="space-y-3">
              <AuthField
                label="Full name" type="text" icon={<Icons.User size={15}/>}
                value={signupForm.name}
                onChange={v => setSignupForm({ ...signupForm, name: v })}
                placeholder="Your name" required
              />
              <AuthField
                label="Email" type="email" icon={<Icons.Mail size={15}/>}
                value={signupForm.email}
                onChange={v => setSignupForm({ ...signupForm, email: v })}
                placeholder="Email address" required
              />
              <AuthField
                label="Phone" type="tel" icon={<Icons.Phone size={15}/>}
                value={signupForm.phone}
                onChange={v => setSignupForm({ ...signupForm, phone: v })}
                placeholder="Phone number (optional)"
              />
              <AuthField
                label="Password" type="password" icon={<Icons.KeyRound size={15}/>}
                value={signupForm.password}
                onChange={v => setSignupForm({ ...signupForm, password: v })}
                placeholder="Create a password" required
              />
              {message && <ErrorMsg>{message}</ErrorMsg>}
              <Button variant="primary" size="lg" className="w-full mt-2" disabled={loading}
                iconRight={<span className="arrow-pulse"><Icons.ArrowRight/></span>}>
                {loading ? 'Creating…' : 'Create account'}
              </Button>
            </form>
          )}
        </div>

        {/* ── Illustration panel ── */}
        <div className="relative hidden lg:flex flex-col items-center justify-center auth-illustration-panel overflow-hidden">
          <SwiftIllustration />
          <div className="relative z-10 text-center mt-8 max-w-[340px] px-6">
            <h2 className="display font-bold text-ink-950 text-[26px] leading-tight tracking-tightest">
              Move through the city with less friction
            </h2>
            <p className="mt-3 text-[14px] text-ink-500 leading-relaxed">
              One clean workspace for riders, drivers, and admins. Every trip, always on time.
            </p>
            <div className="mt-6 flex items-center justify-center gap-6 text-[12px] text-ink-500">
              <span className="flex items-center gap-1.5"><Icons.Shield size={13}/> Verified drivers</span>
              <span className="flex items-center gap-1.5"><Icons.Star size={13}/> 4.96 avg rating</span>
              <span className="flex items-center gap-1.5"><Icons.Zap size={13}/> 4 min pickup</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

function AuthField({ label, icon, type = 'text', value, onChange, placeholder, required }) {
  return (
    <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ink-50 border border-black/[0.08] hover:border-ink-950 hover:bg-white transition-colors cursor-text group">
      <span className="text-ink-400 group-hover:text-ink-700">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="label-caps text-ink-500">{label}</div>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent outline-none text-[14px] font-medium text-ink-950 placeholder:text-ink-400 placeholder:font-normal mt-0.5"
        />
      </div>
    </label>
  );
}

function ErrorMsg({ children }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-ink-50 border border-ink-200 text-[13px] text-ink-700">
      <Icons.Close size={13}/>
      {children}
    </div>
  );
}

function SwiftIllustration() {
  return (
    <div className="relative z-10 w-[min(380px,88%)]" aria-hidden="true">
      <svg viewBox="0 0 560 420" className="w-full h-auto">
        <defs>
          <linearGradient id="carTint" x1="120" x2="430" y1="260" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e8f5e9"/>
            <stop offset="1" stopColor="#c8e6c9"/>
          </linearGradient>
        </defs>
        <g fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1">
          <path d="M84 96h392M84 154h392M84 212h392M84 270h392M144 62v294M224 62v294M304 62v294M384 62v294"/>
        </g>
        <path d="M92 300 C150 242 190 330 248 264 C314 188 388 250 466 132" fill="none" stroke="#c8e6c9" strokeWidth="16" strokeLinecap="round"/>
        <path d="M106 308 C164 250 202 338 260 272 C326 196 398 258 480 140" fill="none" stroke="#0A0A0A" strokeWidth="6" strokeLinecap="round"/>
        <g transform="translate(96 282)">
          <path d="M22 0c12 0 22 10 22 22 0 16-22 40-22 40S0 38 0 22C0 10 10 0 22 0Z" fill="#0A0A0A"/>
          <circle cx="22" cy="22" r="8" fill="white"/>
        </g>
        <g transform="translate(438 96)">
          <path d="M22 0c12 0 22 10 22 22 0 16-22 40-22 40S0 38 0 22C0 10 10 0 22 0Z" fill="#0A0A0A"/>
          <circle cx="22" cy="22" r="8" fill="white"/>
        </g>
        <g transform="translate(78 100)">
          <rect width="128" height="164" rx="28" fill="white" stroke="#0A0A0A" strokeWidth="3"/>
          <rect x="22" y="30" width="84" height="40" rx="14" fill="white" stroke="#0A0A0A" strokeWidth="3"/>
          <path d="M28 98h72M28 122h50" stroke="#0A0A0A" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="64" cy="142" r="11" fill="#c8e6c9" stroke="#0A0A0A" strokeWidth="3"/>
        </g>
        <g transform="translate(340 234)">
          <rect width="138" height="90" rx="18" fill="white" stroke="#0A0A0A" strokeWidth="3"/>
          <path d="M24 30h76M24 54h48" stroke="#0A0A0A" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="108" cy="48" r="18" fill="#c8e6c9" stroke="#0A0A0A" strokeWidth="3"/>
        </g>
        <g transform="translate(150 202)">
          <path d="M54 102h246c20 0 36 16 36 36v13H18v-13c0-20 16-36 36-36Z" fill="url(#carTint)" stroke="#0A0A0A" strokeWidth="4" strokeLinejoin="round"/>
          <path d="M78 102l42-72h128l56 72" fill="none" stroke="#0A0A0A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M140 54h86M96 126h146" stroke="#0A0A0A" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="82" cy="154" r="25" fill="#0A0A0A"/>
          <circle cx="270" cy="154" r="25" fill="#0A0A0A"/>
        </g>
      </svg>
    </div>
  );
}
