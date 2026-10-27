import { useMonth } from '../services/useMonth';
import { inr } from '../services/api';
import { CategoryPie, MonthlyBar } from '../components/Charts';

export default function Analytics() {
  const { ym, setYm, data, error } = useMonth();
  if (error) return <div className="notice error">{error}</div>;
  if (!data) return <p className="muted">Loading analytics…</p>;
  const { stats } = data;
  return (
    <>
      <div className="page-head"><h1>Analytics</h1>
        <input type="month" value={ym} onChange={(e) => e.target.value && setYm(e.target.value)} /></div>
      <div className="cards">
        <div className="card"><span>Highest spending category</span>
          <strong>{stats.topCategory ? `${stats.topCategory.category} (${inr(stats.topCategory.total)})` : 'No data'}</strong></div>
        <div className="card"><span>Average daily expense</span><strong>{inr(stats.avgDaily)}</strong></div>
      </div>
      <div className="grid2">
        <div className="card"><h3>Category-wise spending</h3><CategoryPie data={stats.byCategory} /></div>
        <div className="card"><h3>Monthly expenses ({stats.year})</h3><MonthlyBar data={stats.byMonth} /></div>
      </div>
    </>
  );
}
