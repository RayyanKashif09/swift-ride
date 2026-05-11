import { LogOut, MapPinned, ShieldCheck } from 'lucide-react';
import { clearSession, getSession } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function Layout({ title, subtitle, children }) {
  const navigate = useNavigate();
  const user = getSession();

  function logout() {
    clearSession();
    navigate('/');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><MapPinned size={26} /></div>
          <div>
            <strong>SwiftRide</strong>
            <span>Urban mobility</span>
          </div>
        </div>
        <div className="profile-block">
          <ShieldCheck size={18} />
          <div>
            <b>{user?.name}</b>
            <span>{user?.role}</span>
          </div>
        </div>
        <button className="ghost-button" onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="main-panel">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
