import React from 'react';

export default function ItemDetails({
  item,
  onBack,
  user,
  onEdit,
  onDelete,
  onResolve,
  possibleMatches = [],
  onSelectMatch
}) {
  if (!item) return null;

  const isOwner = user && item.postedBy && (
    (typeof item.postedBy === 'object' && item.postedBy._id === user._id) ||
    item.postedBy === user._id ||
    item.postedBy === user.id
  );

  const isLost = item.type === 'LOST';

  return (
    <div className="detail-card">
      <div style={{ marginBottom: '16px' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="detail-header">
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '8px' }}>
            {item.title}
          </h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
              {item.type}
            </span>
            <span className={`badge ${item.status === 'RESOLVED' ? 'badge-resolved' : 'badge-active'}`}>
              {item.status}
            </span>
          </div>
        </div>

        {/* Action buttons for owner */}
        {isOwner && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {item.status !== 'RESOLVED' && (
              <button
                className="btn btn-success"
                style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                onClick={() => onResolve(item._id || item.id)}
              >
                ✓ Mark Resolved
              </button>
            )}
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
              onClick={() => onEdit(item)}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger"
              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
              onClick={() => onDelete(item._id || item.id)}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      <div className="detail-info-grid">
        <div className="info-item">
          <span className="info-label">Category</span>
          <span className="info-val">{item.category}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Location</span>
          <span className="info-val">{item.location}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Date Reported</span>
          <span className="info-val">
            {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Status</span>
          <span className="info-val">{item.status}</span>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '8px', color: '#1e293b' }}>Description</h3>
        <p style={{ color: '#475569', whiteSpace: 'pre-line', lineHeight: '1.7' }}>
          {item.description}
        </p>
      </div>

      {/* Possible Matches Section */}
      <div className="match-section">
        <div className="match-header">
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>
            🔎 Possible Matches ({possibleMatches.length})
          </h2>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>
          {isLost
            ? 'Found posts that share matching category, location, or keywords:'
            : 'Lost posts that share matching category, location, or keywords:'}
        </p>

        {possibleMatches.length === 0 ? (
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
            No automatic matches detected yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {possibleMatches.map((match) => (
              <div
                key={match.item._id || match.item.id}
                style={{
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#ffffff'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                    <span className={`badge ${match.item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                      {match.item.type}
                    </span>
                    <strong style={{ color: '#0f172a' }}>{match.item.title}</strong>
                    <span className="match-score-badge">Match Score: {match.score} pts</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    📁 {match.item.category} • 📍 {match.item.location}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                    {match.item.description.slice(0, 100)}...
                  </div>
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => onSelectMatch(match.item)}
                >
                  View Item
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
