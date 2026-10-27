import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, CATEGORIES, METHODS } from '../services/api';

const blank = () => ({ title: '', amount: '', category: 'Food', date: new Date().toISOString().slice(0, 10), paymentMethod: 'UPI', description: '' });

// One form for both "Add" (/add) and "Edit" (/edit/:id)
export default function ExpenseForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [f, setF] = useState(blank());
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setOk(''); setErr('');
    if (!id) { setF(blank()); return; }
    api.get(id).then((e) => setF({ ...e, date: e.date.slice(0, 10) })).catch((e) => setErr(e.message));
  }, [id]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setOk(''); setErr('');
    if (!f.title.trim()) return setErr('Title is required.');
    if (!(Number(f.amount) > 0)) return setErr('Amount must be greater than zero.');
    if (!f.date) return setErr('Date is required.');
    setBusy(true);
    try {
      const body = { ...f, amount: Number(f.amount) };
      if (id) { await api.update(id, body); nav('/expenses', { state: { msg: 'Expense updated successfully.' } }); }
      else { await api.create(body); setOk('Expense added successfully.'); setF(blank()); }
    } catch (x) { setErr(x.message); }
    setBusy(false);
  }

  return (
    <>
      <div className="page-head"><h1>{id ? 'Edit expense' : 'Add expense'}</h1></div>
      <form className="card form" onSubmit={submit}>
        {err && <div className="notice error">{err}</div>}
        {ok && <div className="notice success">{ok}</div>}
        <label>Title<input value={f.title} onChange={set('title')} placeholder="e.g. Lunch" maxLength={100} /></label>
        <label>Amount (₹)<input type="number" step="0.01" min="0" value={f.amount} onChange={set('amount')} placeholder="0.00" /></label>
        <label>Category<select value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>Date<input type="date" value={f.date} onChange={set('date')} /></label>
        <label>Payment method<select value={f.paymentMethod} onChange={set('paymentMethod')}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select></label>
        <label>Description (optional)<textarea rows="3" value={f.description} onChange={set('description')} maxLength={300} /></label>
        <button className="btn" disabled={busy}>{busy ? 'Saving…' : id ? 'Save changes' : 'Add expense'}</button>
      </form>
    </>
  );
}
