import React, { useState } from 'react';
import { FaUser, FaCog, FaBell, FaPalette, FaLock } from 'react-icons/fa';

const SettingsPage = () => {
  const [selected, setSelected] = useState('profile');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
  });
  const [notifications, setNotifications] = useState([
    'Welcome to the app!',
    'Your profile was viewed 5 times.',
    'Update available!',
  ]);

  const [form, setForm] = useState({ ...user });

  const handleSave = () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    setUser(form);
    alert('Account details updated!');
  };

  const handleDeleteNotification = (index) => {
    const updated = [...notifications];
    updated.splice(index, 1);
    setNotifications(updated);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: '#f4f4f4', padding: '1rem' }}>
        <h2>Settings</h2>
        <button onClick={() => setSelected('profile')} style={btnStyle}>
          <FaUser /> Profile
        </button>
        <button onClick={() => setSelected('account')} style={btnStyle}>
          <FaCog /> Account Setting
        </button>
        <button onClick={() => setSelected('notifications')} style={btnStyle}>
          <FaBell /> Notifications
        </button>
        <button onClick={() => setSelected('appearance')} style={btnStyle}>
          <FaPalette /> Appearance
        </button>
        <button onClick={() => setSelected('security')} style={btnStyle}>
          <FaLock /> Security
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        {selected === 'profile' && (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </>
        )}

        {selected === 'account' && (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Account Setting</h2>
            <label>Name:</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <label>Email:</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
            />
            <button onClick={handleSave} style={saveBtnStyle}>Save</button>
          </>
        )}

        {selected === 'notifications' && (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Notifications</h2>
            {notifications.length === 0 ? (
              <p>No notifications.</p>
            ) : (
              <ul>
                {notifications.map((note, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>
                    {note}
                    <button
                      onClick={() => handleDeleteNotification(idx)}
                      style={{ marginLeft: '1rem', color: 'red' }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {selected === 'appearance' && <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Appearance (Coming Soon)</h2>}
        {selected === 'security' && <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Security (Coming Soon)</h2>}
      </div>
    </div>
  );
};

const btnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  marginBottom: '0.5rem',
  background: '#fff',
  border: '1px solid #ccc',
  cursor: 'pointer',
  width: '100%',
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '0.5rem',
  marginBottom: '1rem',
  border: '1px solid #ccc',
};

const saveBtnStyle = {
  padding: '0.5rem 1rem',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

export default SettingsPage;
