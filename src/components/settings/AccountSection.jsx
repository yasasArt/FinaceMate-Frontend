import React, { useState, useEffect } from 'react';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

export const AccountSection = ({ user }) => {
  const [form, setForm] = useState({
    displayName: user.displayName,
    email: user.email
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      displayName: user.displayName,
      email: user.email
    });
  }, [user]);

  const handleSave = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await axios.patch('http://localhost:8088/api/v1/users/updateMe', form);
      alert('Account details updated successfully!');
    } catch (error) {
      alert('Error updating account: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-xl mt-8">
      <h2 className="text-4xl font-extrabold mb-3 text-center text-blue-800">Account Settings</h2>
      <p className="mb-10 text-gray-500 text-center text-lg">
        Update your account information and settings
      </p>
      <div className="rounded-xl shadow p-8 bg-white border border-gray-100">
        <div className="mb-8">
          <label className="block mb-2 font-semibold text-gray-700">Full Name</label>
          <input
            type="text"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            className="block w-full px-5 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-gray-900 bg-gray-50"
            placeholder="Enter your full name"
          />
        </div>
        <div className="mb-8">
          <label className="block mb-2 font-semibold text-gray-700">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="block w-full px-5 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-gray-900 bg-gray-50"
            placeholder="Enter your email address"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-md ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <FaCheck /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
