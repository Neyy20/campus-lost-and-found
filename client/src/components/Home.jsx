import React from 'react';
import ItemCard from './ItemCard';

export default function Home({
  items,
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  locationFilter,
  setLocationFilter,
  onResetFilters,
  onViewDetails,
  loading
}) {
  return (
    <div>
      <div className="hero">
        <h1>Campus Lost & Found</h1>
        <p>Report lost belongings or help fellow students find what they lost.</p>
      </div>

      <div className="controls-card">
        {/* Search Bar */}
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search items by title, description, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="filter-row">
          <div className="tabs-group">
            <button
              className={`tab-btn ${typeFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setTypeFilter('ALL')}
            >
              ALL
            </button>
            <button
              className={`tab-btn ${typeFilter === 'LOST' ? 'active' : ''}`}
              onClick={() => setTypeFilter('LOST')}
            >
              LOST
            </button>
            <button
              className={`tab-btn ${typeFilter === 'FOUND' ? 'active' : ''}`}
              onClick={() => setTypeFilter('FOUND')}
            >
              FOUND
            </button>
          </div>

          <div className="select-group">
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="ID Card">ID Card</option>
              <option value="Wallet">Wallet</option>
              <option value="Bottle">Bottle</option>
              <option value="Bag">Bag</option>
              <option value="Books/Notebook">Books/Notebook</option>
              <option value="Keys">Keys</option>
              <option value="Electronics">Electronics</option>
              <option value="Other">Other</option>
            </select>

            <select
              className="filter-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              <option value="Library">Library</option>
              <option value="Canteen">Canteen</option>
              <option value="Classroom">Classroom</option>
              <option value="Parking">Parking</option>
              <option value="Ground">Ground</option>
              <option value="Hostel">Hostel</option>
              <option value="Other">Other</option>
            </select>

            {(searchQuery || typeFilter !== 'ALL' || categoryFilter || locationFilter) && (
              <button className="reset-btn" onClick={onResetFilters}>
                Clear Filters ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Items */}
      {loading ? (
        <div className="empty-state">
          <h3>Loading items...</h3>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>No items found</h3>
          <p>Try clearing your filters or be the first to report an item!</p>
        </div>
      ) : (
        <div className="cards-grid">
          {items.map((item) => (
            <ItemCard key={item._id || item.id} item={item} onViewDetails={onViewDetails} />
          ))}
        </div>
      )}
    </div>
  );
}
