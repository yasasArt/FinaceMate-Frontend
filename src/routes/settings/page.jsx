import React, { useState } from 'react';
import { FaUser, FaCog, FaBell, FaPalette, FaLock, FaTrash, FaCheck, FaChevronRight } from 'react-icons/fa';

const SettingsPage = () => {
  const [selected, setSelected] = useState('profile');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  });
  const [notifications, setNotifications] = useState([
    'Welcome to the app!',
    'Your profile was viewed 5 times.',
    'Update available!',
  ]);
  const [form, setForm] = useState({ ...user });
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
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

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      setUser({ name: '', email: '' });
      alert('Profile deleted!');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      fontFamily: "'Inter', sans-serif",
      backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa',
      color: darkMode ? '#ffffff' : '#333333'
    }}>
      {/* Sidebar */}
      <div style={{ 
        width: '280px', 
        background: darkMode ? '#2d2d2d' : '#ffffff', 
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderRight: darkMode ? '1px solid #444' : '1px solid #e0e0e0'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: darkMode ? '1px solid #444' : '1px solid #e0e0e0'
        }}>Settings</h2>
        <nav>
          <MenuItem 
            icon={<FaUser />} 
            title="Profile" 
            active={selected === 'profile'} 
            onClick={() => setSelected('profile')}
            darkMode={darkMode}
          />
          <MenuItem 
            icon={<FaCog />} 
            title="Account" 
            active={selected === 'account'} 
            onClick={() => setSelected('account')}
            darkMode={darkMode}
          />
          <MenuItem 
            icon={<FaBell />} 
            title="Notifications" 
            active={selected === 'notifications'} 
            onClick={() => setSelected('notifications')}
            darkMode={darkMode}
          />
          <MenuItem 
            icon={<FaPalette />} 
            title="Appearance" 
            active={selected === 'appearance'} 
            onClick={() => setSelected('appearance')}
            darkMode={darkMode}
          />
          <MenuItem 
            icon={<FaLock />} 
            title="Security" 
            active={selected === 'security'} 
            onClick={() => setSelected('security')}
            darkMode={darkMode}
          />
        </nav>
      </div>

      {/* Main content */}
      <div style={{ 
        flex: 1, 
        padding: '2rem',
        backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa'
      }}>
        {selected === 'profile' && (
          <div style={sectionStyle}>
            <h2 style={headingStyle}>Profile Information</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <img 
                src={user.avatar} 
                alt="Profile" 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '1rem',
                  border: `3px solid ${darkMode ? '#444' : '#e0e0e0'}`
                }} 
              />
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{user.name}</h3>
                <p style={{ color: darkMode ? '#aaa' : '#666' }}>{user.email}</p>
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Personal Details</h3>
              <div style={detailItemStyle}>
                <span style={{ color: darkMode ? '#aaa' : '#666', width: '120px' }}>Full Name:</span>
                <span>{user.name}</span>
              </div>
              <div style={detailItemStyle}>
                <span style={{ color: darkMode ? '#aaa' : '#666', width: '120px' }}>Email:</span>
                <span>{user.email}</span>
              </div>
              <div style={detailItemStyle}>
                <span style={{ color: darkMode ? '#aaa' : '#666', width: '120px' }}>Member Since:</span>
                <span>January 2023</span>
              </div>
            </div>
            
            <button 
              onClick={handleDeleteProfile} 
              style={{ 
                ...dangerButtonStyle,
                backgroundColor: darkMode ? '#5a1a1a' : '#f8d7da',
                color: darkMode ? '#ff6b6b' : '#721c24'
              }}
            >
              <FaTrash /> Delete Account
            </button>
          </div>
        )}

        {selected === 'account' && (
          <div style={sectionStyle}>
            <h2 style={headingStyle}>Account Settings</h2>
            <p style={{ color: darkMode ? '#aaa' : '#666', marginBottom: '2rem' }}>
              Update your account information and settings
            </p>
            
            <div style={{ 
              backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    ...inputStyle,
                    backgroundColor: darkMode ? '#3d3d3d' : '#ffffff',
                    borderColor: darkMode ? '#444' : '#ddd',
                    color: darkMode ? '#fff' : '#333'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    ...inputStyle,
                    backgroundColor: darkMode ? '#3d3d3d' : '#ffffff',
                    borderColor: darkMode ? '#444' : '#ddd',
                    color: darkMode ? '#fff' : '#333'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={handleSave} 
                  style={{
                    ...primaryButtonStyle,
                    backgroundColor: darkMode ? '#4a6bff' : '#405cf5'
                  }}
                >
                  <FaCheck /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {selected === 'notifications' && (
          <div style={sectionStyle}>
            <h2 style={headingStyle}>Notifications</h2>
            <p style={{ color: darkMode ? '#aaa' : '#666', marginBottom: '2rem' }}>
              Manage your notification preferences
            </p>
            
            <div style={{ 
              backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              {notifications.length === 0 ? (
                <p style={{ textAlign: 'center', color: darkMode ? '#aaa' : '#666' }}>
                  No notifications to display.
                </p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {notifications.map((note, idx) => (
                    <li key={idx} style={{ 
                      padding: '1rem',
                      borderBottom: darkMode ? '1px solid #444' : '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{note}</span>
                      <button
                        onClick={() => handleDeleteNotification(idx)}
                        style={{ 
                          background: 'none',
                          border: 'none',
                          color: darkMode ? '#ff6b6b' : '#dc3545',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <FaTrash /> Dismiss
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {selected === 'appearance' && (
          <div style={sectionStyle}>
            <h2 style={headingStyle}>Appearance</h2>
            <p style={{ color: darkMode ? '#aaa' : '#666', marginBottom: '2rem' }}>
              Customize the look and feel of the application
            </p>
            
            <div style={{ 
              backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Dark Mode</h3>
                  <p style={{ color: darkMode ? '#aaa' : '#666', fontSize: '0.9rem' }}>
                    Switch between light and dark theme
                  </p>
                </div>
                <label style={switchStyle}>
                  <input 
                    type="checkbox" 
                    checked={darkMode} 
                    onChange={() => setDarkMode(!darkMode)} 
                  />
                  <span style={{
                    ...sliderStyle,
                    backgroundColor: darkMode ? '#4a6bff' : '#ccc'
                  }}></span>
                </label>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Theme Color</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['#405cf5', '#4CAF50', '#9C27B0', '#FF5722', '#607D8B'].map(color => (
                    <div 
                      key={color}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        cursor: 'pointer',
                        border: color === '#405cf5' ? '2px solid #fff' : 'none',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <p style={{ 
                color: darkMode ? '#aaa' : '#666', 
                fontSize: '0.9rem',
                fontStyle: 'italic'
              }}>
                More appearance options coming soon!
              </p>
            </div>
          </div>
        )}

        {selected === 'security' && (
          <div style={sectionStyle}>
            <h2 style={headingStyle}>Security</h2>
            <p style={{ color: darkMode ? '#aaa' : '#666', marginBottom: '2rem' }}>
              Manage your account security settings
            </p>
            
            <div style={{ 
              backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <SecurityItem 
                title="Change Password" 
                description="Update your current password"
                darkMode={darkMode}
              />
              <SecurityItem 
                title="Two-Factor Authentication" 
                description="Add an extra layer of security"
                darkMode={darkMode}
                enabled={false}
              />
              <SecurityItem 
                title="Login History" 
                description="View recent account activity"
                darkMode={darkMode}
              />
              <SecurityItem 
                title="Connected Devices" 
                description="Manage devices with access"
                darkMode={darkMode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable components
const MenuItem = ({ icon, title, active, onClick, darkMode }) => (
  <button 
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '0.75rem 1rem',
      marginBottom: '0.5rem',
      background: active ? (darkMode ? '#3d3d3d' : '#f0f0f0') : 'transparent',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      color: darkMode ? '#ffffff' : '#333333',
      transition: 'all 0.2s ease',
      fontWeight: active ? '600' : '400'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <span style={{ color: active ? (darkMode ? '#4a6bff' : '#405cf5') : (darkMode ? '#aaa' : '#666') }}>
        {icon}
      </span>
      <span>{title}</span>
    </div>
    <FaChevronRight style={{ fontSize: '0.8rem', opacity: 0.7 }} />
  </button>
);

const SecurityItem = ({ title, description, darkMode, enabled }) => (
  <div style={{ 
    padding: '1rem',
    borderBottom: darkMode ? '1px solid #444' : '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{title}</h3>
      <p style={{ color: darkMode ? '#aaa' : '#666', fontSize: '0.85rem' }}>{description}</p>
    </div>
    {enabled !== undefined ? (
      <span style={{ 
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        backgroundColor: enabled ? (darkMode ? '#1a3e1a' : '#d4edda') : (darkMode ? '#3d3d3d' : '#f8f9fa'),
        color: enabled ? (darkMode ? '#6bd96b' : '#28a745') : (darkMode ? '#aaa' : '#666'),
        fontSize: '0.8rem',
        border: darkMode ? '1px solid #444' : '1px solid #ddd'
      }}>
        {enabled ? 'Enabled' : 'Disabled'}
      </span>
    ) : (
      <FaChevronRight style={{ color: darkMode ? '#aaa' : '#666', fontSize: '0.8rem' }} />
    )}
  </div>
);

// Styles
const sectionStyle = {
  maxWidth: '800px',
  margin: '0 auto'
};

const headingStyle = {
  fontSize: '1.8rem',
  fontWeight: '600',
  marginBottom: '1rem'
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500'
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '1rem',
  transition: 'border-color 0.2s ease'
};

const primaryButtonStyle = {
  padding: '0.75rem 1.5rem',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: '#ffffff',
  transition: 'all 0.2s ease'
};

const dangerButtonStyle = {
  padding: '0.75rem 1.5rem',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease'
};

const detailItemStyle = {
  display: 'flex',
  padding: '0.75rem 0',
  borderBottom: '1px solid #eee'
};

const switchStyle = {
  position: 'relative',
  display: 'inline-block',
  width: '60px',
  height: '34px'
};

const sliderStyle = {
  position: 'absolute',
  cursor: 'pointer',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  transition: '.4s',
  borderRadius: '34px'
};

export default SettingsPage;