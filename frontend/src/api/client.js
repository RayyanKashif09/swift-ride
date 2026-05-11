import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

export function saveSession(user) {
  localStorage.setItem('swiftride_user', JSON.stringify(user));
}

export function getSession() {
  const raw = localStorage.getItem('swiftride_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('swiftride_user');
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem('swiftride_user');
}
