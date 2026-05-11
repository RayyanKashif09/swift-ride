import { CarFront, KeyRound, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, saveSession } from '../api/client';

const demoUsers = [
  ['Admin', 'admin@swiftride.com', 'admin123'],
  ['Rider', 'ahmed@gmail.com', 'rider123'],
  ['Driver', 'bilal@gmail.com', 'driver123'],
];

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'ahmed@gmail.com', password: 'rider123' });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      saveSession(data);
      navigate(`/${data.role.toLowerCase()}`);
    } catch {
      setError('Invalid login or backend is not running.');
    }
  }

  return (
    <main className="login-screen">
      <section className="login-visual">
        <div className="city-lines" />
        <div className="hero-copy">
          <div className="brand large"><div className="brand-mark"><CarFront size={30} /></div><strong>SwiftRide</strong></div>
          <h1>Ride booking, driver dispatch, fares, maps and reports in one student-friendly system.</h1>
          <p>React frontend, Spring Boot APIs, MySQL tables, Leaflet maps and Chart.js reporting.</p>
        </div>
      </section>
      <section className="login-card">
        <h2>Sign in</h2>
        <form onSubmit={submit}>
          <label><Mail size={17} /> Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label><KeyRound size={17} /> Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="error">{error}</p>}
          <button className="primary-button">Login</button>
        </form>
        <div className="demo-grid">
          {demoUsers.map(([role, email, password]) => (
            <button key={role} onClick={() => setForm({ email, password })}>
              <b>{role}</b><span>{email}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
