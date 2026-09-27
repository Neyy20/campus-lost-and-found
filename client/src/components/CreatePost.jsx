import React, { useState, useEffect } from 'react';

export default function CreatePost({ onSubmit, onCancel, editItem }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'LOST',
    category: 'Wallet',
    location: 'Library',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editItem) {
      setFormData({
        title: editItem.title || '',
        type: editItem.type || 'LOST',
        category: editItem.category || 'Wallet',
        location: editItem.location || 'Library',
        date: editItem.date ? editItem.date.split('T')[0] : new Date().toISOString().split('T')[0],
        description: editItem.description || ''
      });
    }
  }, [editItem]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in title and description.');
      return;
    }
    setError('');
    onSubmit(formData);
  };

  return (
    <div className="form-card">
      <h2 className="form-title">
        {editItem ? '✏️ Edit Post' : '📢 Report Lost or Found Item'}
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Item Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="e.g. Black Titan Leather Wallet"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select
              name="type"
              className="form-control"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="LOST">🔴 LOST (I lost it)</option>
              <option value="FOUND">🟢 FOUND (I found it)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="ID Card">ID Card</option>
              <option value="Wallet">Wallet</option>
              <option value="Bottle">Bottle</option>
              <option value="Bag">Bag</option>
              <option value="Books/Notebook">Books/Notebook</option>
              <option value="Keys">Keys</option>
              <option value="Electronics">Electronics</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Campus Location</label>
            <select
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="Library">Library</option>
              <option value="Canteen">Canteen</option>
              <option value="Classroom">Classroom</option>
              <option value="Parking">Parking</option>
              <option value="Ground">Ground</option>
              <option value="Hostel">Hostel</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date Lost / Found</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description (Details, identifying marks, where left, etc.)</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            placeholder="Provide specific details so the rightful owner can recognize it..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary btn-full">
            {editItem ? 'Save Changes' : 'Post Item'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
