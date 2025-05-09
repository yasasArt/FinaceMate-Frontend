import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';

export const ProfileSection = ({ user }) => {
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        await axios.delete('http://localhost:8088/api/v1/users/deleteMe');
        alert('Profile deleted successfully!');
        // You might want to redirect to login or home page here
      } catch (error) {
        alert('Error deleting profile: ' + error.response?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-800">Profile Information</h2>
      <div className="flex items-center mb-10">
        <img 
          src={userData.image || 'https://via.placeholder.com/150'} 
          alt="Profile" 
          className="w-24 h-24 rounded-full object-cover mr-6 border-4 border-indigo-500 shadow-md"
        />
        <div>
          <h3 className="text-2xl font-semibold mb-2 text-indigo-700">{userData.displayName}</h3>
          <p className="text-md text-gray-700 font-medium">{userData.email}</p>
        </div>
      </div>
      <div className="mb-8 rounded-lg shadow p-8 bg-white border border-gray-200">
        <h3 className="text-xl font-semibold mb-6 border-b border-gray-300 pb-2">Personal Details</h3>
        <div className="flex py-4 border-b border-gray-300 last:border-b-0">
          <span className="w-40 text-gray-600 font-medium">Full Name:</span>
          <span className="text-gray-800">{userData.displayName}</span>
        </div>
        <div className="flex py-4 border-b border-gray-300 last:border-b-0">
          <span className="w-40 text-gray-600 font-medium">Email:</span>
          <span className="text-gray-800">{userData.email}</span>
        </div>
        <div className="flex py-4">
          <span className="w-40 text-gray-600 font-medium">Member Since:</span>
          <span className="text-gray-800">{new Date(userData.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <button
        onClick={handleDeleteProfile}
        className="flex items-center gap-3 px-8 py-3 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors duration-300"
      >
        <FaTrash className="text-lg" /> Delete Account
      </button>
    </div>
  );
};
