import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getSession } from './api/client';
import Login from './pages/Login.jsx';
import RiderDashboard from './pages/RiderDashboard.jsx';
import DriverDashboard from './pages/DriverDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function ProtectedRoute({ role, children }) {
  const user = getSession();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/rider"
          element={<ProtectedRoute role="RIDER"><RiderDashboard /></ProtectedRoute>}
        />
        <Route
          path="/driver"
          element={<ProtectedRoute role="DRIVER"><DriverDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
