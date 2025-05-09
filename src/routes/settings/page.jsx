// pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sidebar } from './../../components/settings/Sidebar';
import { ProfileSection } from './../../components/settings/ProfileSection';
import { AccountSection } from './../../components/settings/AccountSection';
import { SecuritySection } from './../../components/settings/SecuritySection';

const SettingsPage = () => {
  const [selected, setSelected] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8088/api/v1/users/me');
        setUser(response.data.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">No user data available</div>;
  }

  return (
    <div className="flex min-h-screen font-sans bg-gray-100 text-gray-900">
      <Sidebar selected={selected} setSelected={setSelected} />
      
      <div className="flex-1 p-8 bg-gray-100">
        {selected === 'profile' && <ProfileSection user={user} />}
        {selected === 'account' && <AccountSection user={user} />}
        {selected === 'security' && <SecuritySection user={user} />}
      </div>
    </div>
  );
};

export default SettingsPage;