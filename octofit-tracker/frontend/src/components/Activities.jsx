import { useEffect, useState } from 'react';

export default function Activities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadActivities = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_CODESPACE_NAME
          ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
          : 'http://localhost:8000/api/activities/';

        const response = await fetch(apiUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const nextItems = Array.isArray(payload) ? payload : payload?.results ?? [];
        setItems(nextItems);
        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load activities');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadActivities();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="alert alert-info">Loading activities…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Activities</h2>
        <div className="list-group">
          {items.length === 0 ? (
            <div className="list-group-item text-muted">No activities logged.</div>
          ) : (
            items.map((activity) => (
              <div key={activity._id || activity.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center gap-3">
                  <div>
                    <div className="fw-semibold">{activity.type}</div>
                    <small className="text-muted">
                      {activity.user?.name || 'Unknown user'} • {activity.durationMinutes} min • {activity.caloriesBurned} kcal
                    </small>
                  </div>
                  <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">
                    {new Date(activity.completedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
