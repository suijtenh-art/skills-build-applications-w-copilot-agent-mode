import { useEffect, useState } from 'react';
import { buildApiUrl } from '../utils/api';

export default function Teams() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadTeams = async () => {
      try {
        setLoading(true);
        const response = await fetch(buildApiUrl('teams'), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const nextItems = Array.isArray(payload) ? payload : payload?.results ?? [];
        setItems(nextItems);
        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load teams');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadTeams();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="alert alert-info">Loading teams…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Teams</h2>
        <div className="list-group">
          {items.length === 0 ? (
            <div className="list-group-item text-muted">No teams available.</div>
          ) : (
            items.map((team) => (
              <div key={team._id || team.id || team.name} className="list-group-item">
                <div className="fw-semibold">{team.name}</div>
                <small className="text-muted">{team.description}</small>
                <div className="mt-2 small text-muted">Members: {team.members?.length ?? 0}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
