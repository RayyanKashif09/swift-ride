import { CarFront, KeyRound, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, saveSession } from '../api/client';

const roleOptions = [
  { label: 'Admin', value: 'ADMIN', icon: ShieldCheck },
  { label: 'Rider', value: 'RIDER', icon: UserRound },
  { label: 'Driver', value: 'DRIVER', icon: CarFront },
];

const credentials = {
  ADMIN: { email: 'admin@swiftride.com', password: 'admin123' },
  RIDER: { email: 'ahmed@gmail.com', password: 'rider123' },
  DRIVER: { email: 'bilal@gmail.com', password: 'driver123' },
};

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('RIDER');
  const [loginForm, setLoginForm] = useState(credentials.RIDER);
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  function chooseRole(nextRole) {
    setRole(nextRole);
    if (mode === 'login') {
      setLoginForm(credentials[nextRole]);
    }
    setMessage('');
  }

  async function submitLogin(event) {
    event.preventDefault();
    setMessage('');
    try {
      const { data } = await api.post('/auth/login', loginForm);
      saveSession(data);
      navigate(`/${data.role.toLowerCase()}`);
    } catch {
      setMessage('Invalid login or backend is not running.');
    }
  }

  async function submitSignup(event) {
    event.preventDefault();
    setMessage('');
    try {
      const { data } = await api.post('/auth/signup', { ...signupForm, role });
      saveSession(data);
      navigate(`/${data.role.toLowerCase()}`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not create account. Check the backend and try again.');
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setMessage('');
    if (nextMode === 'login') {
      setLoginForm(credentials[role]);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-form-panel">
          <div className="auth-brand">
            <strong>SwiftRide</strong>
          </div>

          <div className="auth-copy">
            <h1>{mode === 'login' ? 'Welcome back!' : 'Create account'}</h1>
            <p>
              {mode === 'login'
                ? 'Sign in to book rides, manage dispatch, and keep every trip moving.'
                : 'Choose your account type and start using SwiftRide right away.'}
            </p>
          </div>

          <div className="auth-tabs" aria-label="Authentication mode">
            <button className={mode === 'login' ? 'active' : ''} type="button" onClick={() => switchMode('login')}>
              Login
            </button>
            <button className={mode === 'signup' ? 'active' : ''} type="button" onClick={() => switchMode('signup')}>
              Sign up
            </button>
          </div>

          {mode === 'login' ? (
            <form className="auth-form" onSubmit={submitLogin}>
              <label><Mail size={16} /> Email</label>
              <input
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                placeholder="Email address"
                type="email"
                required
              />
              <label><KeyRound size={16} /> Password</label>
              <input
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                placeholder="Password"
                type="password"
                required
              />
              <RoleCircles role={role} onChoose={chooseRole} />
              {message && <p className="error">{message}</p>}
              <button className="primary-button">Login</button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={submitSignup}>
              <label><UserRound size={16} /> Full name</label>
              <input
                value={signupForm.name}
                onChange={(event) => setSignupForm({ ...signupForm, name: event.target.value })}
                placeholder="Your name"
                required
              />
              <label><Mail size={16} /> Email</label>
              <input
                value={signupForm.email}
                onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })}
                placeholder="Email address"
                type="email"
                required
              />
              <label><Phone size={16} /> Phone</label>
              <input
                value={signupForm.phone}
                onChange={(event) => setSignupForm({ ...signupForm, phone: event.target.value })}
                placeholder="Phone number"
              />
              <label><KeyRound size={16} /> Password</label>
              <input
                value={signupForm.password}
                onChange={(event) => setSignupForm({ ...signupForm, password: event.target.value })}
                placeholder="Create password"
                type="password"
                required
              />
              <RoleCircles role={role} onChoose={chooseRole} />
              {message && <p className="error">{message}</p>}
              <button className="primary-button">Create account</button>
            </form>
          )}
        </div>

        <aside className="auth-illustration-panel">
          <SwiftRideIllustration />
          <div className="auth-panel-copy">
            <h2>Move through the city with less friction</h2>
            <p>One clean workspace for customers, drivers, and admins.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function RoleCircles({ role, onChoose }) {
  return (
    <div className="role-circles" aria-label="Choose account type">
      {roleOptions.map((option) => {
        const Icon = option.icon;
        return (
          <button
            aria-label={option.label}
            className={role === option.value ? 'active' : ''}
            key={option.value}
            type="button"
            onClick={() => onChoose(option.value)}
          >
            <Icon size={17} />
          </button>
        );
      })}
    </div>
  );
}

function SwiftRideIllustration() {
  return (
    <div className="ride-illustration" aria-hidden="true">
      <svg viewBox="0 0 560 420" role="img">
        <defs>
          <linearGradient id="carTint" x1="120" x2="430" y1="260" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#dff4e1" />
            <stop offset="1" stopColor="#aee2b4" />
          </linearGradient>
        </defs>

        <g className="map-grid">
          <path d="M84 96h392M84 154h392M84 212h392M84 270h392M144 62v294M224 62v294M304 62v294M384 62v294" />
        </g>

        <path className="route route-back" d="M92 300 C150 242 190 330 248 264 C314 188 388 250 466 132" />
        <path className="route" d="M106 308 C164 250 202 338 260 272 C326 196 398 258 480 140" />

        <g className="pin pin-start" transform="translate(96 282)">
          <path d="M22 0c12 0 22 10 22 22 0 16-22 40-22 40S0 38 0 22C0 10 10 0 22 0Z" />
          <circle cx="22" cy="22" r="8" />
        </g>
        <g className="pin pin-end" transform="translate(438 96)">
          <path d="M22 0c12 0 22 10 22 22 0 16-22 40-22 40S0 38 0 22C0 10 10 0 22 0Z" />
          <circle cx="22" cy="22" r="8" />
        </g>

        <g className="phone-card" transform="translate(78 100)">
          <rect width="128" height="164" rx="28" />
          <rect x="22" y="30" width="84" height="40" rx="14" />
          <path d="M28 98h72" />
          <path d="M28 122h50" />
          <circle cx="64" cy="142" r="11" />
        </g>

        <g className="trip-card" transform="translate(340 234)">
          <rect width="138" height="90" rx="18" />
          <path d="M24 30h76" />
          <path d="M24 54h48" />
          <circle cx="108" cy="48" r="18" />
        </g>

        <g className="car-shape" transform="translate(150 202)">
          <path className="car-body" d="M54 102h246c20 0 36 16 36 36v13H18v-13c0-20 16-36 36-36Z" />
          <path d="M78 102l42-72h128l56 72" />
          <path d="M140 54h86" />
          <path d="M96 126h146" />
          <circle cx="82" cy="154" r="25" />
          <circle cx="270" cy="154" r="25" />
        </g>

        <g className="orbit orbit-one">
          <circle cx="58" cy="58" r="30" />
          <path d="M44 58h28M50 49h16l8 9v10H42V58l8-9Z" />
          <circle cx="50" cy="68" r="3" />
          <circle cx="66" cy="68" r="3" />
        </g>
        <g className="orbit orbit-two">
          <circle cx="498" cy="208" r="30" />
          <circle cx="498" cy="198" r="10" />
          <path d="M480 226c5-12 31-12 36 0" />
        </g>
      </svg>
    </div>
  );
}
