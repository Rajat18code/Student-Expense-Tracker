import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMonth } from '../services/useMonth';
import { api, inr } from '../services/api';
import BudgetBar from '../components/BudgetBar';
import ExpenseTable from '../components/ExpenseTable';
import { CategoryPie, MonthlyBar } from '../components/Charts';

export default function Dashboard() {
  const { ym, setYm, data, error } = useMonth();
  const [recent, setRecent] = useState([]);
  useEffect(() => { api.list({ sort: 'date', order: 'desc', limit: 5 }).then((r) => setRecent(r.data)).catch(() => {}); }, []);

  if (error) return <div className="notice error">{error}</div>;
  if (!data) return <p className="muted">Loading dashboard…</p>;
  const { stats, budget } = data;
  const remaining = budget.amount - stats.total;

  return (
    <>
      <div className="page-head"><h1>Dashboard</h1>
        <input type="month" value={ym} onChange={(e) => e.target.value && setYm(e.target.value)} /></div>
      <div className="cards">
        <div className="card"><span>Spent this month</span><strong>{inr(stats.total)}</strong></div>
        <div className="card"><span>Monthly budget</span><strong>{budget.amount ? inr(budget.amount) : 'Not set'}</strong></div>
        <div className="card"><span>Remaining budget</span><strong className={budget.amount && remaining < 0 ? 'neg' : ''}>{budget.amount ? inr(remaining) : '—'}</strong></div>
        <div className="card"><span>Transactions</span><strong>{stats.count}</strong></div>
      </div>
      <div className="card"><BudgetBar spent={stats.total} budget={budget.amount} /></div>
      <div className="grid2">
        <div className="card"><h3>Monthly expenses ({stats.year})</h3><MonthlyBar data={stats.byMonth} /></div>
        <div className="card"><h3>Spending by category</h3><CategoryPie data={stats.byCategory} /></div>
      </div>
      <div className="card"><h3>Recent transactions <Link className="more" to="/expenses">View all</Link></h3><ExpenseTable rows={recent} /></div>
    </>
  );
}
