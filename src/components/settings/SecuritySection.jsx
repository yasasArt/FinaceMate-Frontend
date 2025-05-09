import React, { useState } from 'react';
import { FaCheck, FaLock, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

export const SecuritySection = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.patch('http://localhost:8088/api/v1/users/updatePassword', {
        currentPassword,
        newPassword
      });
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (user.provider !== 'email') {
    return (
      <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-xl mt-8">
        <h2 className="text-4xl font-extrabold mb-3 text-center text-blue-800">Security</h2>
        <div className="rounded-xl shadow p-8 bg-white border border-gray-100 flex items-center gap-6">
          <div className="p-4 rounded-full bg-blue-50 text-blue-700 text-2xl">
            <FaLock />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Password Update</h3>
            <p className="text-gray-500">
              Password management is handled by <span className="font-semibold capitalize">{user.provider}</span>. You cannot change your password here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-2xl shadow-xl mt-8">
      <h2 className="text-4xl font-extrabold mb-3 text-center text-blue-800">Security</h2>
      <p className="mb-10 text-gray-500 text-center text-lg">
        Manage your account security settings
      </p>
      <div className="rounded-xl shadow p-8 bg-white border border-gray-100">
        <h3 className="text-xl font-semibold mb-6 text-blue-700">Change Password</h3>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}
        <form onSubmit={handlePasswordUpdate}>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="block w-full px-5 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 text-gray-900"
              placeholder="Enter your current password"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full px-5 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 text-gray-900"
              placeholder="Enter a new password"
              required
            />
          </div>
          <div className="mb-8">
            <label className="block mb-2 font-semibold text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-5 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 text-gray-900"
              placeholder="Confirm your new password"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-md ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <FaCheck /> Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
