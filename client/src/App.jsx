import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import ItemDetails from './components/ItemDetails';
import MyPosts from './components/MyPosts';
import Login from './components/Login';
import Register from './components/Register';
import { findPossibleMatches } from './utils/matching';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campus_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('campus_token') || '');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const [authError, setAuthError] = useState('');
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Fetch Items from Backend
  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (typeFilter && typeFilter !== 'ALL') params.append('type', typeFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (locationFilter) params.append('location', locationFilter);

      const res = await fetch(`${API_BASE}/items?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.warn('Backend not responding yet or network error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when search/filter inputs change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItems();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, typeFilter, categoryFilter, locationFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setCategoryFilter('');
    setLocationFilter('');
  };

  // Auth Handlers
  const handleLogin = async ({ email, password }) => {
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.message || 'Login failed.');
        return;
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('campus_user', JSON.stringify(data.user));
      localStorage.setItem('campus_token', data.token);
      showNotification(`Welcome back, ${data.user.name}!`);
      setCurrentView('home');
    } catch (err) {
      setAuthError('Unable to connect to server. Ensure backend is running.');
    }
  };

  const handleRegister = async ({ name, email, password }) => {
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.message || 'Registration failed.');
        return;
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('campus_user', JSON.stringify(data.user));
      localStorage.setItem('campus_token', data.token);
      showNotification(`Account created! Welcome, ${data.user.name}.`);
      setCurrentView('home');
    } catch (err) {
      setAuthError('Unable to connect to server. Ensure backend is running.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('campus_user');
    localStorage.removeItem('campus_token');
    showNotification('Logged out successfully.');
    setCurrentView('home');
  };

  // Item Actions
  const handleSavePost = async (formData) => {
    if (!user) {
      alert('Please log in first to post an item.');
      setCurrentView('login');
      return;
    }

    try {
      const url = editItem ? `${API_BASE}/items/${editItem._id || editItem.id}` : `${API_BASE}/items`;
      const method = editItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Error saving post.');
        return;
      }

      showNotification(editItem ? 'Post updated successfully!' : 'Item posted successfully!');
      setEditItem(null);
      fetchItems();
      setCurrentView('home');
    } catch (err) {
      alert('Server error: ' + err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`${API_BASE}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Error deleting item.');
        return;
      }
      showNotification('Post deleted.');
      fetchItems();
      if (selectedItem && (selectedItem._id === itemId || selectedItem.id === itemId)) {
        setSelectedItem(null);
        setCurrentView('home');
      }
    } catch (err) {
      alert('Server error: ' + err.message);
    }
  };

  const handleResolveItem = async (itemId) => {
    try {
      const res = await fetch(`${API_BASE}/items/${itemId}/resolve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Error resolving item.');
        return;
      }
      showNotification('Item marked as Resolved! 🎉');
      fetchItems();
      if (selectedItem && (selectedItem._id === itemId || selectedItem.id === itemId)) {
        setSelectedItem({ ...selectedItem, status: 'RESOLVED' });
      }
    } catch (err) {
      alert('Server error: ' + err.message);
    }
  };

  const handleStartEdit = (item) => {
    setEditItem(item);
    setCurrentView('create');
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setCurrentView('details');
  };

  // If not logged in, enforce the Campus Login Gate
  if (!user) {
    return (
      <div>
        <nav className="navbar">
          <div className="navbar-brand">
            <span>🎓</span>
            <span>Campus Lost & Found</span>
          </div>
          <div className="navbar-links">
            <button
              className={`nav-btn ${currentView !== 'register' ? 'active' : ''}`}
              onClick={() => {
                setAuthError('');
                setCurrentView('login');
              }}
            >
              Login
            </button>
            <button
              className={`nav-btn primary ${currentView === 'register' ? 'active' : ''}`}
              onClick={() => {
                setAuthError('');
                setCurrentView('register');
              }}
            >
              Register
            </button>
          </div>
        </nav>

        <div className="container">
          <div className="hero" style={{ marginTop: '20px' }}>
            <h1>Campus Lost & Found</h1>
            <p>Official student portal. Please sign in or register to report or recover items.</p>
          </div>

          {currentView === 'register' ? (
            <Register
              onRegister={handleRegister}
              onSwitchToLogin={() => {
                setAuthError('');
                setCurrentView('login');
              }}
              error={authError}
            />
          ) : (
            <Login
              onLogin={handleLogin}
              onSwitchToRegister={() => {
                setAuthError('');
                setCurrentView('register');
              }}
              error={authError}
            />
          )}
        </div>
      </div>
    );
  }

  // Once authenticated, render full application
  return (
    <div>
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'create') setEditItem(null);
          setCurrentView(view);
        }}
        user={user}
        onLogout={handleLogout}
      />

      <div className="container">
        {notification && <div className="alert alert-success">{notification}</div>}

        {currentView === 'home' && (
          <Home
            items={items}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            onResetFilters={handleResetFilters}
            onViewDetails={handleViewDetails}
            loading={loading}
          />
        )}

        {currentView === 'create' && (
          <CreatePost
            editItem={editItem}
            onSubmit={handleSavePost}
            onCancel={() => {
              setEditItem(null);
              setCurrentView('home');
            }}
          />
        )}

        {currentView === 'details' && selectedItem && (
          <ItemDetails
            item={selectedItem}
            user={user}
            onBack={() => setCurrentView('home')}
            onEdit={handleStartEdit}
            onDelete={handleDeleteItem}
            onResolve={handleResolveItem}
            onSelectMatch={(matchItem) => setSelectedItem(matchItem)}
          />
        )}

        {currentView === 'myposts' && (
          <MyPosts
            user={user}
            items={items}
            onViewDetails={handleViewDetails}
            onEdit={handleStartEdit}
            onDelete={handleDeleteItem}
            onResolve={handleResolveItem}
            onCreateNew={() => {
              setEditItem(null);
              setCurrentView('create');
            }}
          />
        )}
      </div>
    </div>
  );
}
