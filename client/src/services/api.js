// All communication with the backend lives here.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...options });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || 'Request failed');
  return body;
}

export const api = {
  list: (q) => request('/expenses?' + new URLSearchParams(q)),
  get: (id) => request('/expenses/' + id),
  create: (d) => request('/expenses', { method: 'POST', body: JSON.stringify(d) }),
  update: (id, d) => request('/expenses/' + id, { method: 'PUT', body: JSON.stringify(d) }),
  remove: (id) => request('/expenses/' + id, { method: 'DELETE' }),
  stats: (y, m) => request(`/expenses/stats?year=${y}&month=${m}`),
  budget: (y, m) => request(`/budget?year=${y}&month=${m}`),
  setBudget: (year, month, amount) => request('/budget', { method: 'PUT', body: JSON.stringify({ year, month, amount }) })
};

export const CATEGORIES = ['Food', 'Transportation', 'Education', 'Shopping', 'Entertainment', 'Accommodation', 'Other'];
export const METHODS = ['Cash', 'UPI', 'Card', 'Net Banking'];
export const inr = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n || 0);
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const thisMonth = () => new Date().toISOString().slice(0, 7);
