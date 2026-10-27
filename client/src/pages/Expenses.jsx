import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { api, CATEGORIES } from '../services/api';
import ExpenseTable from '../components/ExpenseTable';

const empty = { search: '', category: '', from: '', to: '', sort: 'date', order: 'desc' };

export default function Expenses() {
  const [f, setF] = useState(empty);
  const [page, setPage] = useState(1);
  const [res, setRes] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState(useLocation().state?.msg || '');

  const load = useCallback(() => {
    const q = { ...f, page, limit: 8 };
    Object.keys(q).forEach((k) => q[k] === '' && delete q[k]);
    setError('');
    api.list(q).then(setRes).catch((e) => setError(e.message));
  }, [f, page]);
  useEffect(() => { load(); }, [load]);

  const change = (k, v) => { setF({ ...f, [k]: v }); setPage(1); };

  async function remove(e) {
    if (!window.confirm(`Delete "${e.title}"? This cannot be undone.`)) return;
    try {
      await api.remove(e._id);
      setMsg('Expense deleted.');
      if (res.data.length === 1 && page > 1) setPage(page - 1); else load();
    } catch (x) { setError(x.message); }
  }

  return (
    <>
      <div className="page-head"><h1>Expenses</h1></div>
      {msg && <div className="notice success">{msg}</div>}
      {error && <div className="notice error">{error}</div>}
      <div className="card filters">
        <input placeholder="Search title…" value={f.search} onChange={(e) => change('search', e.target.value)} />
        <select value={f.category} onChange={(e) => change('category', e.target.value)}>
          <option value="">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input type="date" title="From" value={f.from} onChange={(e) => change('from', e.target.value)} />
        <input type="date" title="To" value={f.to} onChange={(e) => change('to', e.target.value)} />
        <select value={`${f.sort}-${f.order}`} onChange={(e) => { const [s, o] = e.target.value.split('-'); setF({ ...f, sort: s, order: o }); setPage(1); }}>
          <option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option><option value="amount-asc">Lowest amount</option>
        </select>
        <button className="btn ghost" onClick={() => { setF(empty); setPage(1); }}>Clear</button>
      </div>
      <div className="card">
        {!res && !error ? <p className="muted">Loading expenses…</p> : res && (
          <>
            <ExpenseTable rows={res.data} onDelete={remove} />
            <div className="pager">
              <button className="btn ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span>Page {res.page} of {Math.max(res.pages, 1)} · {res.total} expenses</span>
              <button className="btn ghost" disabled={page >= res.pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
