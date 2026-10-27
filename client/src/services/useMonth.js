import { useState, useEffect, useCallback } from 'react';
import { api, thisMonth } from './api';

// Loads stats + budget for the selected month ("YYYY-MM"). Used by Dashboard, Budget, Analytics.
export function useMonth() {
  const [ym, setYm] = useState(thisMonth());
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    try {
      const [y, m] = ym.split('-').map(Number);
      const [stats, budget] = await Promise.all([api.stats(y, m), api.budget(y, m)]);
      setData({ stats, budget });
      setError('');
    } catch (e) { setError(e.message); }
  }, [ym]);
  useEffect(() => { setData(null); load(); }, [load]);
  return { ym, setYm, data, error, reload: load };
}
