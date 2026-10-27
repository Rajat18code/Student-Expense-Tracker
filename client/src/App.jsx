import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, Wallet, PieChart, Menu, X } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import ExpenseForm from './pages/ExpenseForm';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';

const links = [
  ['/', 'Dashboard', LayoutDashboard], ['/add', 'Add Expense', PlusCircle], ['/expenses', 'Expenses', List],
  ['/budget', 'Budget', Wallet], ['/analytics', 'Analytics', PieChart]
];

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <BrowserRouter>
      <div className="layout">
        <header className="topbar">
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
          <b>Expense Tracker</b>
        </header>
        <aside className={'sidebar' + (open ? ' open' : '')}>
          <h2>Expense Tracker</h2>
          <nav>
            {links.map(([to, label, Icon]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}><Icon size={18} />{label}</NavLink>
            ))}
          </nav>
        </aside>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<ExpenseForm />} />
            <Route path="/edit/:id" element={<ExpenseForm />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
