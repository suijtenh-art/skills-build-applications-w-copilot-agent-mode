import { useEffect, useState } from 'react';
import { buildApiUrl } from '../utils/api';

export default function Leaderboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch(buildApiUrl('leaderboard'), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const nextItems = Array.isArray(payload) ? payload : payload?.results ?? [];
        setItems(nextItems);
        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load leaderboard');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadLeaderboard();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="alert alert-info">Loading leaderboard…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Leaderboard</h2>
        <div className="list-group">
          {items.length === 0 ? (
            <div className="list-group-item text-muted">No leaderboard entries.</div>
          ) : (
            items.map((entry) => (
              <div key={entry._id || entry.id || entry.user} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">#{entry.rank || 0} • {entry.user?.name || 'Unknown user'}</div>
                  <small className="text-muted">{entry.user?.email || 'No email provided'}</small>
                </div>
                <span className="badge bg-success text-white">{entry.points || 0} pts</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
