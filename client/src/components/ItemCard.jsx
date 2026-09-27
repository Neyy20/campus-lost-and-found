import React from 'react';

export default function ItemCard({ item, onViewDetails }) {
  const isLost = item.type === 'LOST';

  return (
    <div className={`item-card ${isLost ? 'lost' : 'found'}`}>
      <div>
        <div className="item-header">
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            {item.type}
          </span>
          <span className={`badge ${item.status === 'RESOLVED' ? 'badge-resolved' : 'badge-active'}`}>
            {item.status}
          </span>
        </div>
        <h3 className="item-title">{item.title}</h3>
        <div className="item-meta">
          <span>📁 {item.category}</span>
          <span>📍 {item.location}</span>
        </div>
        <p className="item-desc">{item.description}</p>
      </div>

      <div className="item-footer">
        <span className="item-date">
          📅 {item.date ? new Date(item.date).toLocaleDateString() : 'Recent'}
        </span>
        <button
          className="btn btn-primary"
          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          onClick={() => onViewDetails(item)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
