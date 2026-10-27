import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { inr } from '../services/api';

const COLORS = ['#4338ca', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function CategoryPie({ data }) {
  if (!data.length) return <p className="empty">No spending recorded for this month.</p>;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="category" innerRadius={60} outerRadius={95}>
          {data.map((d, i) => <Cell key={d.category} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => inr(v)} /><Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyBar({ data }) {
  const rows = data.map((d) => ({ name: MONTHS[d.month - 1], total: d.total }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" /><YAxis /><Tooltip formatter={(v) => inr(v)} />
        <Bar dataKey="total" name="Spent" fill="#4338ca" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
