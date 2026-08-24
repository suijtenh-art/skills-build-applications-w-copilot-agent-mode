import { useEffect, useState } from 'react';

export default function Users() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_CODESPACE_NAME
          ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
          : 'http://localhost:8000/api/users/';

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
          setError(err.message || 'Unable to load users');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadUsers();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="alert alert-info">Loading users…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Users</h2>
        <div className="list-group">
          {items.length === 0 ? (
            <div className="list-group-item text-muted">No users available.</div>
          ) : (
            items.map((user) => (
              <div key={user._id || user.id || user.email} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center gap-3">
                  <div>
                    <div className="fw-semibold">{user.name}</div>
                    <small className="text-muted">{user.email}</small>
                  </div>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="rounded-circle" width="40" height="40" />
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
