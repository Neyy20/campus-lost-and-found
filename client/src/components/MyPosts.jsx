import React from 'react';

export default function MyPosts({
  user,
  items,
  onViewDetails,
  onEdit,
  onDelete,
  onResolve,
  onCreateNew
}) {
  const userItems = items.filter((item) => {
    if (!user) return false;
    const ownerId = typeof item.postedBy === 'object' ? item.postedBy?._id : item.postedBy;
    return ownerId === user._id || ownerId === user.id;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>My Posts</h1>
          <p style={{ color: '#64748b' }}>Manage your reported lost and found items</p>
        </div>
        <button className="btn btn-primary" onClick={onCreateNew}>
          + New Post
        </button>
      </div>

      {userItems.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't posted any items yet.</h3>
          <p>Have you lost or found something on campus?</p>
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={onCreateNew}>
              Create a Post
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {userItems.map((item) => {
            const isLost = item.type === 'LOST';
            const itemId = item._id || item.id;

            return (
              <div
                key={itemId}
                style={{
                  background: '#ffffff',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  borderLeft: `5px solid ${isLost ? '#ef4444' : '#10b981'}`
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
                      {item.type}
                    </span>
                    <span className={`badge ${item.status === 'RESOLVED' ? 'badge-resolved' : 'badge-active'}`}>
                      {item.status}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>
                      {item.title}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    📁 {item.category} • 📍 {item.location} • 📅 {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: '6px', maxWidth: '600px' }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                    onClick={() => onViewDetails(item)}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </button>

                  {item.status !== 'RESOLVED' && (
                    <button
                      className="btn btn-success"
                      style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                      onClick={() => onResolve(itemId)}
                    >
                      Mark Resolved
                    </button>
                  )}

                  <button
                    className="btn btn-danger"
                    style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                    onClick={() => onDelete(itemId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
