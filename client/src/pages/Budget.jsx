import { useEffect, useState } from 'react';
import { useMonth } from '../services/useMonth';
import { api, inr } from '../services/api';
import BudgetBar from '../components/BudgetBar';

export default function Budget() {
  const { ym, setYm, data, error, reload } = useMonth();
  const [amt, setAmt] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => { if (data) setAmt(data.budget.amount || ''); }, [data]);

  async function save(e) {
    e.preventDefault(); setMsg(''); setErr('');
    if (!(Number(amt) > 0)) return setErr('Enter a budget greater than zero.');
    try {
      const [y, m] = ym.split('-').map(Number);
      await api.setBudget(y, m, Number(amt));
      setMsg('Budget saved.'); reload();
    } catch (x) { setErr(x.message); }
  }

  return (
    <>
      <div className="page-head"><h1>Monthly budget</h1>
        <input type="month" value={ym} onChange={(e) => e.target.value && setYm(e.target.value)} /></div>
      {error && <div className="notice error">{error}</div>}
      <form className="card form" onSubmit={save}>
        {err && <div className="notice error">{err}</div>}
        {msg && <div className="notice success">{msg}</div>}
        <label>Budget for this month (₹)<input type="number" min="1" value={amt} onChange={(e) => setAmt(e.target.value)} /></label>
        <button className="btn">Save budget</button>
      </form>
      {data && (
        <div className="card">
          <p>Spent <b>{inr(data.stats.total)}</b> of <b>{data.budget.amount ? inr(data.budget.amount) : 'no budget'}</b></p>
          {data.budget.amount > 0 && <p>Remaining: <b className={data.budget.amount < data.stats.total ? 'neg' : ''}>{inr(data.budget.amount - data.stats.total)}</b></p>}
          <BudgetBar spent={data.stats.total} budget={data.budget.amount} />
        </div>
      )}
    </>
  );
}
