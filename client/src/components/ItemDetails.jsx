import React, { useState, useEffect } from 'react';
import { calculateMatchScore, findPossibleMatches } from '../utils/matching';

const API_BASE = 'http://localhost:5000/api';

export default function ItemDetails({
  item,
  onBack,
  user,
  onEdit,
  onDelete,
  onResolve,
  onSelectMatch
}) {
  const [candidates, setCandidates] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  if (!item) return null;

  const isOwner = user && item.postedBy && (
    (typeof item.postedBy === 'object' && item.postedBy._id === user._id) ||
    item.postedBy === user._id ||
    item.postedBy === user.id
  );

  const isLost = item.type === 'LOST';
  const oppositeType = isLost ? 'FOUND' : 'LOST';

  // Automatically fetch ALL items of the opposite type from the database to guarantee accurate matching
  useEffect(() => {
    let isMounted = true;
    async function fetchCandidateMatches() {
      setLoadingMatches(true);
      try {
        const res = await fetch(`${API_BASE}/items?type=${oppositeType}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setCandidates(data.items || []);
          }
        }
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        if (isMounted) setLoadingMatches(false);
      }
    }

    fetchCandidateMatches();
    return () => {
      isMounted = false;
    };
  }, [item._id, item.id, item.type]);

  const matches = findPossibleMatches(item, candidates, 3);

  return (
    <div className="detail-card">
      <div style={{ marginBottom: '16px' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Items
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
            🔎 Possible Matches ({matches.length})
          </h2>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>
          {isLost
            ? 'Candidate FOUND posts from database that share matching category, location, or keywords:'
            : 'Candidate LOST posts from database that share matching category, location, or keywords:'}
        </p>

        {loadingMatches ? (
          <div style={{ padding: '16px', color: '#64748b' }}>
            Searching database for possible matches...
          </div>
        ) : matches.length === 0 ? (
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', color: '#64748b' }}>
            No matching opposite posts found yet in the database.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {matches.map((match) => (
              <div
                key={match.item._id || match.item.id}
                style={{
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <span className={`badge ${match.item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                      {match.item.type}
                    </span>
                    <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>{match.item.title}</strong>
                    <span className="match-score-badge">Match Score: {match.score} pts</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' }}>
                    📁 Category: <strong>{match.item.category}</strong> • 📍 Location: <strong>{match.item.location}</strong>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                    {match.item.description.slice(0, 120)}...
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '8px 14px', whiteSpace: 'nowrap' }}
                  onClick={() => onSelectMatch(match.item)}
                >
                  View Matched Item →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
