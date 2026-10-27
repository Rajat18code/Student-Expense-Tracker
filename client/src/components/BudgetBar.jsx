import { Link } from 'react-router-dom';

export default function BudgetBar({ spent, budget }) {
  if (!budget) return <p className="muted">No budget set for this month. <Link to="/budget">Set a budget</Link></p>;
  const pct = Math.round((spent / budget) * 100);
  const state = pct >= 100 ? 'over' : pct >= 80 ? 'warn' : 'ok';
  return (
    <div>
      <div className="bar"><div className={'fill ' + state} style={{ width: Math.min(pct, 100) + '%' }} /></div>
      <p className={'msg ' + state}>
        {pct}% of budget used
        {state === 'over' && ' – you have exceeded your budget!'}
        {state === 'warn' && ' – you are close to your limit.'}
      </p>
    </div>
  );
}
