import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { inr, fmtDate } from '../services/api';

export default function ExpenseTable({ rows, onDelete }) {
  if (!rows.length) return <p className="empty">No expenses found. Add an expense to get started.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Title</th><th>Amount</th><th>Category</th><th>Date</th><th>Payment</th>{onDelete && <th>Actions</th>}</tr></thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e._id}>
              <td>{e.title}{e.isSample && <span className="tag">Sample</span>}</td>
              <td>{inr(e.amount)}</td><td>{e.category}</td><td>{fmtDate(e.date)}</td><td>{e.paymentMethod}</td>
              {onDelete && (
                <td className="actions">
                  <Link to={`/edit/${e._id}`} title="Edit"><Pencil size={16} /></Link>
                  <button onClick={() => onDelete(e)} title="Delete"><Trash2 size={16} /></button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
