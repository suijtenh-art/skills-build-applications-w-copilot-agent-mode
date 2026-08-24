import { useEffect, useState } from 'react';

export default function Workouts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadWorkouts = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_CODESPACE_NAME
          ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
          : 'http://localhost:8000/api/workouts/';

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
          setError(err.message || 'Unable to load workouts');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadWorkouts();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="alert alert-info">Loading workouts…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Workouts</h2>
        <div className="list-group">
          {items.length === 0 ? (
            <div className="list-group-item text-muted">No workouts planned.</div>
          ) : (
            items.map((workout) => (
              <div key={workout._id || workout.id || workout.title} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center gap-3">
                  <div>
                    <div className="fw-semibold">{workout.title}</div>
                    <small className="text-muted">{workout.description}</small>
                  </div>
                  <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill">
                    {workout.difficulty}
                  </span>
                </div>
                <div className="mt-2 small text-muted">
                  {workout.durationMinutes} min • {workout.exercises?.length ?? 0} exercises
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
