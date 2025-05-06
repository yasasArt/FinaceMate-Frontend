import React, { useState } from 'react';
import {
  FaUser, FaCog, FaBell, FaPalette, FaLock, FaTrash, FaCheck, FaChevronRight,
} from 'react-icons/fa';

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
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`w-72 p-6 shadow-md border-r transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-2xl font-semibold mb-8 pb-4 border-b transition-colors duration-300 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          Settings
        </h2>
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
      <div className={`flex-1 p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {selected === 'profile' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4">Profile Information</h2>
            <div className="flex items-center mb-8">
              <img 
                src={user.avatar} 
                alt="Profile" 
                className={`w-20 h-20 rounded-full object-cover mr-4 border-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              />
              <div>
                <h3 className="text-xl mb-1">{user.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
              </div>
            </div>
            <div className={`mb-6 rounded-lg shadow p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg mb-4">Personal Details</h3>
              <div className="flex py-3 border-b last:border-b-0">
                <span className={`w-32 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex py-3 border-b last:border-b-0">
                <span className={`w-32 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex py-3">
                <span className={`w-32 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Member Since:</span>
                <span>January 2023</span>
              </div>
            </div>
            <button
              onClick={handleDeleteProfile}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors duration-200
                ${darkMode ? 'bg-red-950 text-red-400 hover:bg-red-900' : 'bg-red-100 text-red-800 hover:bg-red-200'}
              `}
            >
              <FaTrash /> Delete Account
            </button>
          </div>
        )}

        {selected === 'account' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4">Account Settings</h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Update your account information and settings
            </p>
            <div className={`rounded-lg shadow p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="mb-6">
                <label className="block mb-2 font-medium">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`block w-full px-4 py-3 rounded-md border transition-colors duration-200
                    ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}
                  `}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`block w-full px-4 py-3 rounded-md border transition-colors duration-200
                    ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}
                  `}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium text-white transition-colors duration-200
                    ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}
                  `}
                >
                  <FaCheck /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {selected === 'notifications' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4">Notifications</h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your notification preferences
            </p>
            <div className={`rounded-lg shadow p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {notifications.length === 0 ? (
                <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No notifications to display.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((note, idx) => (
                    <li key={idx} className="flex justify-between items-center py-4">
                      <span>{note}</span>
                      <button
                        onClick={() => handleDeleteNotification(idx)}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors
                          ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}
                        `}
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
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4">Appearance</h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Customize the look and feel of the application
            </p>
            <div className={`rounded-lg shadow p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg mb-1">Dark Mode</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Switch between light and dark theme
                  </p>
                </div>
                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="sr-only peer" />
                  <div className={`w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700
                    ${darkMode ? 'bg-blue-600' : ''}
                  `}></div>
                  <div className={`absolute left-1 top-1 bg-white border border-gray-300 h-6 w-6 rounded-full transition-transform
                    ${darkMode ? 'translate-x-6' : ''}
                  `}></div>
                </label>
              </div>
              <div className="mb-6">
                <h3 className="text-lg mb-4">Theme Color</h3>
                <div className="flex gap-4">
                  {['#405cf5', '#4CAF50', '#9C27B0', '#FF5722', '#607D8B'].map(color => (
                    <div
                      key={color}
                      className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <p className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                More appearance options coming soon!
              </p>
            </div>
          </div>
        )}

        {selected === 'security' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4">Security</h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your account security settings
            </p>
            <div className={`rounded-lg shadow p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
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
    className={`
      flex items-center justify-between w-full px-4 py-3 mb-2 rounded-md transition-colors
      ${active ? (darkMode ? 'bg-gray-700 font-semibold' : 'bg-gray-100 font-semibold') : ''}
      ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-200'}
    `}
  >
    <div className="flex items-center gap-3">
      <span className={active ? (darkMode ? 'text-blue-400' : 'text-blue-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}>
        {icon}
      </span>
      <span>{title}</span>
    </div>
    <FaChevronRight className="text-xs opacity-70" />
  </button>
);

const SecurityItem = ({ title, description, darkMode, enabled }) => (
  <div className={`flex justify-between items-center py-4 border-b last:border-b-0 transition-colors
    ${darkMode ? 'border-gray-700' : 'border-gray-200'}
  `}>
    <div>
      <h3 className="text-base mb-1">{title}</h3>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    </div>
    {enabled !== undefined ? (
      <span className={`
        px-3 py-1 rounded-full text-xs font-medium border transition-colors
        ${enabled
          ? (darkMode ? 'bg-green-900 text-green-300 border-green-700' : 'bg-green-100 text-green-700 border-green-200')
          : (darkMode ? 'bg-gray-700 text-gray-400 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-200')
        }
      `}>
        {enabled ? 'Enabled' : 'Disabled'}
      </span>
    ) : (
      <FaChevronRight className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
    )}
  </div>
);

export default SettingsPage;
